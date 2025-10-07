import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`front_page_blocks_small_featured_posts_wrapper_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_small_featured_posts_wrapper\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_posts_order_idx\` ON \`front_page_blocks_small_featured_posts_wrapper_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_posts_parent_id_idx\` ON \`front_page_blocks_small_featured_posts_wrapper_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_posts_locale_idx\` ON \`front_page_blocks_small_featured_posts_wrapper_posts\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_posts_wrapper_posts_ima_idx\` ON \`front_page_blocks_small_featured_posts_wrapper_posts\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_front_page_v_blocks_small_featured_posts_wrapper_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v_blocks_small_featured_posts_wrapper\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_posts_wrapper_posts_order_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_posts_wrapper_posts_parent_id_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_posts_wrapper_posts_locale_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper_posts\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_posts_wrapper_posts__idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper_posts\` (\`image_id\`);`)
  await db.run(sql`DROP TABLE \`front_page_blocks_small_featured_post\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_small_featured_post\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`front_page_blocks_small_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_order_idx\` ON \`front_page_blocks_small_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_parent_id_idx\` ON \`front_page_blocks_small_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_path_idx\` ON \`front_page_blocks_small_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_locale_idx\` ON \`front_page_blocks_small_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`front_page_blocks_small_featured_post_image_idx\` ON \`front_page_blocks_small_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_front_page_v_blocks_small_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_post_order_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_post_parent_id_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_post_path_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_post_locale_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_front_page_v_blocks_small_featured_post_image_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`image_id\`);`)
  await db.run(sql`DROP TABLE \`front_page_blocks_small_featured_posts_wrapper_posts\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_small_featured_posts_wrapper_posts\`;`)
}
