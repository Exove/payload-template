import OpenAI from "openai";
import path from "path";
import type { CollectionSlug, Payload, PayloadRequest } from "payload";
import { getPayload } from "payload";
import { fileURLToPath } from "url";
import config from "../payload.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUMBER_OF_CONTACTS = 10;
const NUMBER_OF_MEDIA = 20;
const NUMBER_OF_ARTICLES = 20;

const collections: CollectionSlug[] = ["users", "categories", "media", "contacts", "articles"];

function getOpenAIInstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Helper function to generate article content using OpenAI
async function generateArticleContent(category: string, language: "fi" | "sv" = "sv") {
  try {
    const openai = getOpenAIInstance();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a content generator for a news website. Generate compelling article titles and content paragraphs that are informative and engaging. Generate the content in ${language === "fi" ? "Finnish" : "Swedish"} language.`,
        },
        {
          role: "user",
          content: `Generate an article about the topic "${category}" in ${language === "fi" ? "Finnish" : "Swedish"} language. Provide the response in JSON format with the following structure: { "title": "article title", "content": "two paragraphs of content" }`,
        },
      ],
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No content generated");
    }

    try {
      // Clean the response content from possible markdown formatting
      const cleanedContent = responseContent
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      // Fallback jos JSON-jäsennys epäonnistuu
      const titleMatch = responseContent.match(/"title":\s*"([^"]+)"/);
      const contentMatch = responseContent.match(/"content":\s*"([^"]+)"/);

      return {
        title: titleMatch ? titleMatch[1] : `Article about ${category}`,
        content: contentMatch ? contentMatch[1] : `This is an article about ${category}.`,
      };
    }
  } catch (error) {
    console.error("Error generating article content:", error);
    // Fallback if OpenAI call fails
    return {
      title: language === "fi" ? `Artikkeli aiheesta ${category}` : `Artikel om ${category}`,
      content:
        language === "fi"
          ? `Tämä on artikkeli aiheesta ${category}. Sisältö tarjoaa tietoa ja näkemyksiä aiheesta.`
          : `Detta är en artikel om ${category}. Innehållet ger information och insikter om ämnet.`,
    };
  }
}

// Helper function to fetch files from URL
async function fetchFileByURL(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file from ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return {
    data: Buffer.from(arrayBuffer),
    mimetype: "image/jpeg",
    name: `image-${Date.now()}.jpg`,
    size: arrayBuffer.byteLength,
  };
}

// Helper function to generate random date
const getRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
};

export const seed = async ({
  payload,
  _req,
}: {
  payload: Payload;
  _req?: PayloadRequest;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  // Clear collections
  payload.logger.info("— Clearing collections...");
  for (const collection of collections) {
    await payload.delete({
      collection: collection,
      where: {
        id: {
          exists: true,
        },
      },
    });
  }

  // Fetch users from DummyJSON API
  const usersResponse = await fetch("https://dummyjson.com/users");
  const usersData = await usersResponse.json();
  const users = usersData.users; // DummyJSON palauttaa käyttäjät users-kentässä

  payload.logger.info("— Creating admin user...");
  const adminUser = await payload.create({
    collection: "users",
    data: {
      email: "admin@example.com",
      password: "Admin123!",
      role: "admin",
    },
  });

  payload.logger.info("— Creating categories...");
  const categoryNames = [
    "Technology",
    "Business",
    "Science",
    "Health",
    "Sports",
    "Entertainment",
    "Politics",
    "Education",
    "Environment",
    "Culture",
  ];

  const categories = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = await payload.create({
      collection: "categories",
      data: {
        label: categoryNames[i],
        slug: categoryNames[i].toLowerCase(),
      },
    });
    categories.push(category);
  }

  payload.logger.info("— Creating media...");
  const mediaItems = [];
  for (let i = 1; i <= NUMBER_OF_MEDIA; i++) {
    const imageFile = await fetchFileByURL(`https://picsum.photos/800/600?random=${i}`);
    const mediaDoc = await payload.create({
      collection: "media",
      data: {
        alt: `Random image ${i}`,
        filename: imageFile.name,
      },
      file: imageFile,
    });
    mediaItems.push(mediaDoc);
  }

  payload.logger.info("— Creating contacts...");
  for (let i = 0; i < NUMBER_OF_CONTACTS; i++) {
    const user = users[i % users.length];
    await payload.create({
      collection: "contacts",
      data: {
        name: `${user.firstName} ${user.lastName}`,
        title: user.company.title,
        email: user.email,
        phone: user.phone,
        image: mediaItems[i % NUMBER_OF_MEDIA].id,
      },
    });
  }

  payload.logger.info("— Creating articles...");
  try {
    for (let i = 0; i < NUMBER_OF_ARTICLES; i++) {
      const category = categories[i % categories.length];

      // Generate content in Finnish (default locale)
      const fiContent = await generateArticleContent(category.label, "fi");

      try {
        // Create article with Finnish content (default locale)
        const article = await payload.create({
          collection: "articles",
          data: {
            title: fiContent.title,
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "paragraph",
                    children: [{ text: fiContent.content, type: "text", version: 1 }],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            },
            author: adminUser.id,
            categories: [category.id],
            publishedDate: getRandomDate(),
            slug: `article-${i + 1}`,
            _status: "published",
            image: mediaItems[i % NUMBER_OF_MEDIA].id,
          },
        });

        // Generate content in Swedish
        const svContent = await generateArticleContent(category.label, "sv");

        // Update the article with Swedish content
        await payload.update({
          collection: "articles",
          id: article.id,
          locale: "sv",
          data: {
            title: svContent.title,
            content: {
              root: {
                type: "root",
                children: [
                  {
                    type: "paragraph",
                    children: [{ text: svContent.content, type: "text", version: 1 }],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            },
            slug: `article-${i + 1}`,
          },
        });
      } catch (err) {
        console.error(`Error creating/updating article ${i + 1}:`, err);
        console.log("Continuing with next article...");
      }
    }
  } catch (err) {
    console.error("Error in articles creation process:", err);
    console.log("Continuing with the rest of the seeding process...");
  }

  payload.logger.info("— Creating front page...");
  await payload.updateGlobal({
    slug: "front-page",
    data: {
      hero: [
        {
          blockType: "hero",
          title: "Hello there!",
          description: "This is hero section",
          image: mediaItems[0].id,
          link: {
            label: "Browse Articles",
            isExternal: true,
            externalUrl: "/articles",
          },
        },
      ],
      content: [
        {
          blockType: "cta",
          title: "Get Started",
          text: "This is CTA component. It is used to promote a specific action or offer.",
          link: {
            label: "View News",
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          blockType: "largeFeaturedPost",
          title: "Featured Article",
          text: "This is large featured post component. It is used to promote a specific article.",
          image: mediaItems[1].id,
          link: {
            label: "Read here",
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          blockType: "smallFeaturedPostsWrapper",
          posts: [
            {
              title: "Technology Trends",
              text: "Discover the latest technology trends",
              image: mediaItems[2].id,
              link: {
                internalUrl: {
                  relationTo: "articles",
                  value: 1,
                },
              },
            },
            {
              title: "Business Insights",
              text: "Expert analysis on business developments",
              image: mediaItems[3].id,
              link: {
                internalUrl: {
                  relationTo: "articles",
                  value: 2,
                },
              },
            },
            {
              title: "Science News",
              text: "Breaking discoveries in science",
              image: mediaItems[4].id,
              link: {
                internalUrl: {
                  relationTo: "articles",
                  value: 3,
                },
              },
            },
          ],
        },
        {
          blockType: "media",
          media: mediaItems[5 % NUMBER_OF_MEDIA].id,
          caption:
            "We are dedicated to bringing you the most relevant and engaging content across various fields including technology, business, and science.",
        },
        {
          blockType: "quote",
          quote: "Our mission is to deliver high-quality content that matters",
          author: "Editorial Team",
        },
        {
          blockType: "videoEmbed",
          youtubeId: "dQw4w9WgXcQ",
          description:
            "Follow us on social media and subscribe to our newsletter to stay updated with the latest content.",
        },
        {
          blockType: "linkList",
          links: [
            {
              internalUrl: {
                relationTo: "articles",
                value: 1,
              },
            },
            {
              isExternal: true,
              externalUrl: "/news",
            },
            {
              isExternal: true,
              externalUrl: "/contact",
            },
          ],
        },
        {
          blockType: "contacts",
          contacts: [
            mediaItems[7 % NUMBER_OF_MEDIA].id,
            mediaItems[8 % NUMBER_OF_MEDIA].id,
            mediaItems[9 % NUMBER_OF_MEDIA].id,
          ],
        },
      ],
    },
  });
  payload.logger.info("— Creating main menu...");
  await payload.updateGlobal({
    slug: "main-menu",
    data: {
      items: [
        {
          label: "Articles",
          addLinks: true,
          children: [
            {
              label: "Technology",
              addLinks: true,
              grandchildren: [
                {
                  label: "Technology",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Business",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Science",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
              ],
            },
            {
              label: "Commerce",
              addLinks: true,
              grandchildren: [
                {
                  label: "Retail",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Wholesale",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Distribution",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
              ],
            },
            {
              label: "Services",
              addLinks: true,
              grandchildren: [
                {
                  label: "Consulting",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
                {
                  label: "Training",
                  link: {
                    isExternal: true,
                    externalUrl: "#",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "News",
          link: {
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          label: "Contact",
          link: {
            isExternal: true,
            externalUrl: "#",
          },
        },
        {
          label: "Blog",
          link: {
            isExternal: true,
            externalUrl: "#",
          },
        },
      ],
    },
  });

  payload.logger.info("— Creating footer menu...");
  await payload.updateGlobal({
    slug: "footer-menu",
    data: {
      items: [
        {
          label: "Company",
          children: [
            {
              link: {
                label: "About Us",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "Contact",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "Careers",
                isExternal: true,
                externalUrl: "#",
              },
            },
          ],
        },
        {
          label: "Content",
          children: [
            {
              link: {
                label: "Articles",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "News",
                isExternal: true,
                externalUrl: "#",
              },
            },
            {
              link: {
                label: "Blog",
                isExternal: true,
                externalUrl: "#",
              },
            },
          ],
        },
      ],
    },
  });

  payload.logger.info("— Creating footer...");
  await payload.updateGlobal({
    slug: "footer",
    data: {
      general: {
        title: "Company Ltd",
        description: "We help companies succeed in the digital world.",
        social: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          youtube: "https://youtube.com",
        },
      },
      contact: {
        title: "Contact Information",
        address: "Example Street 123",
        postalCode: "00100",
        city: "Helsinki",
        phone: "+358 50 123 4567",
        email: "info@company.com",
      },
      copyright: "All rights reserved.",
    },
  });

  payload.logger.info("✨ Seed data created successfully!");
};

// Main function to initialize Payload and run seed
const runSeed = async () => {
  try {
    const payload = await getPayload({ config });
    await seed({ payload });
    process.exit(0);
  } catch (err) {
    console.error("Seed data creation failed:");
    console.error(err);
    process.exit(1);
  }
};

runSeed();
