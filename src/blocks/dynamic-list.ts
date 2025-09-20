import { Block, getPayload } from "payload";

type CollectionType = "articles";

export const dynamicListBlock: Block = {
  slug: "dynamicList",
  interfaceName: "DynamicListBlock",
  labels: {
    singular: "Dynamic List",
    plural: "Dynamic Lists",
  },
  fields: [
    {
      name: "collections",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        { label: "Articles", value: "articles" },
        { label: "Contacts", value: "contacts" },
      ],
    },
    {
      name: "language",
      type: "select",
      required: true,
      defaultValue: "fi",
      options: [
        { label: "Finnish", value: "fi" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "sortBy",
      type: "select",
      required: true,
      defaultValue: "createdAt",
      options: [
        { label: "Created At", value: "createdAt" },
        { label: "Updated At", value: "updatedAt" },
        { label: "Published Date", value: "publishedDate" },
      ],
    },
    {
      name: "sortOrder",
      type: "select",
      required: true,
      defaultValue: "desc",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
    },
    {
      name: "limit",
      type: "number",
      required: true,
      defaultValue: 3,
      min: 1,
      max: 100,
    },
    {
      name: "items",
      type: "array",
      admin: {
        readOnly: true,
        hidden: true,
      },
      hooks: {
        afterRead: [
          async ({ siblingData }) => {
            if (
              !siblingData?.collections ||
              !siblingData?.sortBy ||
              !siblingData?.sortOrder ||
              !siblingData?.limit
            ) {
              return [];
            }

            const config = await import("@/payload.config").then((m) => m.default);
            const payload = await getPayload({
              config,
            });

            // Get all the results from the collections
            const results = await Promise.all(
              (siblingData.collections as CollectionType[]).map(async (collection) => {
                // First fetch sticky items
                const stickyResponse = await payload.find({
                  collection: collection,
                  where: {
                    sticky: {
                      equals: true,
                    },
                  },
                  sort:
                    siblingData.sortOrder === "desc"
                      ? `-${siblingData.sortBy}`
                      : siblingData.sortBy,
                  depth: 0,
                  locale: siblingData.language,
                  draft: false,
                });

                // Then fetch non-sticky items
                const nonStickyResponse = await payload.find({
                  collection: collection,
                  where: {
                    or: [
                      {
                        sticky: {
                          exists: false,
                        },
                      },
                      {
                        sticky: {
                          equals: false,
                        },
                      },
                    ],
                  },
                  sort:
                    siblingData.sortOrder === "desc"
                      ? `-${siblingData.sortBy}`
                      : siblingData.sortBy,
                  limit: siblingData.limit,
                  depth: 0,
                  locale: siblingData.language,
                  draft: false,
                });

                // Combine sticky and non-sticky items
                const allDocs = [...stickyResponse.docs, ...nonStickyResponse.docs];

                // Map the docs to the reference objects
                return allDocs.map((doc) => ({
                  reference: {
                    relationTo: collection,
                    value: doc.id,
                  },
                  sortValue: doc[siblingData.sortBy as keyof typeof doc],
                  sticky: Boolean(doc.sticky),
                }));
              }),
            );

            const flattenedResults = results.flat();

            // Sort combined results
            const sortedResults = flattenedResults.sort((a, b) => {
              // First check sticky status
              if (a.sticky && !b.sticky) return -1;
              if (!a.sticky && b.sticky) return 1;

              // If sticky status is the same, sort by date
              if (siblingData.sortOrder === "desc") {
                return (
                  new Date(b.sortValue as string).getTime() -
                  new Date(a.sortValue as string).getTime()
                );
              }
              return (
                new Date(a.sortValue as string).getTime() -
                new Date(b.sortValue as string).getTime()
              );
            });

            // Apply final limit
            const limitedResults = sortedResults.slice(0, siblingData.limit);

            // Return only the reference objects
            return limitedResults.map((item) => ({
              reference: item.reference,
            }));
          },
        ],
      },
      fields: [
        {
          name: "reference",
          type: "relationship",
          relationTo: ["articles"],
          required: true,
        },
      ],
    },
  ],
};
