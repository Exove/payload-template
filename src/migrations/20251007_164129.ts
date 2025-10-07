import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`role\` text DEFAULT 'user' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`folder_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_admin_thumbnail_url\` text,
  	\`sizes_admin_thumbnail_width\` numeric,
  	\`sizes_admin_thumbnail_height\` numeric,
  	\`sizes_admin_thumbnail_mime_type\` text,
  	\`sizes_admin_thumbnail_filesize\` numeric,
  	\`sizes_admin_thumbnail_filename\` text,
  	FOREIGN KEY (\`folder_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_folder_idx\` ON \`media\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_sizes_admin_thumbnail_sizes_admin_thumbnail_filena_idx\` ON \`media\` (\`sizes_admin_thumbnail_filename\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`media_locales\` (
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_blocks_tabs_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_blocks_tabs_tabs_order_idx\` ON \`articles_blocks_tabs_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_blocks_tabs_tabs_parent_id_idx\` ON \`articles_blocks_tabs_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_blocks_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_blocks_tabs_order_idx\` ON \`articles_blocks_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_blocks_tabs_parent_id_idx\` ON \`articles_blocks_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_blocks_tabs_path_idx\` ON \`articles_blocks_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`created_by_id\` integer,
  	\`sticky\` integer,
  	\`author_id\` integer,
  	\`published_date\` text,
  	\`collection\` text DEFAULT 'articles',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_created_by_idx\` ON \`articles\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_author_idx\` ON \`articles\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_locales\` (
  	\`title\` text,
  	\`image_id\` integer,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_image_idx\` ON \`articles_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_meta_meta_image_idx\` ON \`articles_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_locales_locale_parent_id_unique\` ON \`articles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_rels_categories_id_idx\` ON \`articles_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_articles_v_blocks_tabs_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`content\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_blocks_tabs_tabs_order_idx\` ON \`_articles_v_blocks_tabs_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_blocks_tabs_tabs_parent_id_idx\` ON \`_articles_v_blocks_tabs_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_articles_v_blocks_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_blocks_tabs_order_idx\` ON \`_articles_v_blocks_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_blocks_tabs_parent_id_idx\` ON \`_articles_v_blocks_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_blocks_tabs_path_idx\` ON \`_articles_v_blocks_tabs\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_created_by_id\` integer,
  	\`version_sticky\` integer,
  	\`version_author_id\` integer,
  	\`version_published_date\` text,
  	\`version_collection\` text DEFAULT 'articles',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version_created_by_idx\` ON \`_articles_v\` (\`version_created_by_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version_author_idx\` ON \`_articles_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_snapshot_idx\` ON \`_articles_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_published_locale_idx\` ON \`_articles_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_articles_v_locales\` (
  	\`version_title\` text,
  	\`version_image_id\` integer,
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_version_image_idx\` ON \`_articles_v_locales\` (\`version_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_version_meta_version_meta_image_idx\` ON \`_articles_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_articles_v_locales_locale_parent_id_unique\` ON \`_articles_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_articles_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_rels_order_idx\` ON \`_articles_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_rels_parent_idx\` ON \`_articles_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_rels_path_idx\` ON \`_articles_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_articles_v_rels_categories_id_idx\` ON \`_articles_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`display_name\` text,
  	\`slug\` text NOT NULL,
  	\`folder_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`folder_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`categories_folder_idx\` ON \`categories\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`categories_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`categories_locales_locale_parent_id_unique\` ON \`categories_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`contacts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`contacts_image_idx\` ON \`contacts\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`contacts_updated_at_idx\` ON \`contacts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`contacts_created_at_idx\` ON \`contacts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`contacts_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`contacts_locales_locale_parent_id_unique\` ON \`contacts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_folders_folder_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_folder_type_order_idx\` ON \`payload_folders_folder_type\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_folder_type_parent_idx\` ON \`payload_folders_folder_type\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_folders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`folder_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`folder_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_name_idx\` ON \`payload_folders\` (\`name\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_folder_idx\` ON \`payload_folders\` (\`folder_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_updated_at_idx\` ON \`payload_folders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_folders_created_at_idx\` ON \`payload_folders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`articles_id\` integer,
  	\`categories_id\` integer,
  	\`contacts_id\` integer,
  	\`payload_folders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_folders_id\`) REFERENCES \`payload_folders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_contacts_id_idx\` ON \`payload_locked_documents_rels\` (\`contacts_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_payload_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_folders_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_hero_order_idx\` ON \`front_page_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_hero_parent_id_idx\` ON \`front_page_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_hero_locale_idx\` ON \`front_page_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_hero_image_idx\` ON \`front_page_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_large_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_large_featured_post_order_idx\` ON \`front_page_blocks_large_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_large_featured_post_parent_id_idx\` ON \`front_page_blocks_large_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_large_featured_post_path_idx\` ON \`front_page_blocks_large_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_large_featured_post_locale_idx\` ON \`front_page_blocks_large_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_large_featured_post_image_idx\` ON \`front_page_blocks_large_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_small_featured_post\` (
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
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_post_order_idx\` ON \`front_page_blocks_small_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_post_parent_id_idx\` ON \`front_page_blocks_small_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_post_path_idx\` ON \`front_page_blocks_small_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_post_locale_idx\` ON \`front_page_blocks_small_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_post_image_idx\` ON \`front_page_blocks_small_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_small_featured_posts_wrapper\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_posts_wrapper_order_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_posts_wrapper_parent_id_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_posts_wrapper_path_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_small_featured_posts_wrapper_locale_idx\` ON \`front_page_blocks_small_featured_posts_wrapper\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_carousel_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_carousel\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_items_order_idx\` ON \`front_page_blocks_carousel_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_items_parent_id_idx\` ON \`front_page_blocks_carousel_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_items_locale_idx\` ON \`front_page_blocks_carousel_items\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_items_image_idx\` ON \`front_page_blocks_carousel_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_carousel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_order_idx\` ON \`front_page_blocks_carousel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_parent_id_idx\` ON \`front_page_blocks_carousel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_path_idx\` ON \`front_page_blocks_carousel\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_carousel_locale_idx\` ON \`front_page_blocks_carousel\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_link_list_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`is_external\` integer,
  	\`external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_link_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_links_order_idx\` ON \`front_page_blocks_link_list_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_links_parent_id_idx\` ON \`front_page_blocks_link_list_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_links_locale_idx\` ON \`front_page_blocks_link_list_links\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_link_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_order_idx\` ON \`front_page_blocks_link_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_parent_id_idx\` ON \`front_page_blocks_link_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_path_idx\` ON \`front_page_blocks_link_list\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_link_list_locale_idx\` ON \`front_page_blocks_link_list\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_contacts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_contacts_order_idx\` ON \`front_page_blocks_contacts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_contacts_parent_id_idx\` ON \`front_page_blocks_contacts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_contacts_path_idx\` ON \`front_page_blocks_contacts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_contacts_locale_idx\` ON \`front_page_blocks_contacts\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`author\` text,
  	\`title\` text,
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_quote_order_idx\` ON \`front_page_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_quote_parent_id_idx\` ON \`front_page_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_quote_path_idx\` ON \`front_page_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_quote_locale_idx\` ON \`front_page_blocks_quote\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_quote_image_idx\` ON \`front_page_blocks_quote\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_rich_text_order_idx\` ON \`front_page_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_rich_text_parent_id_idx\` ON \`front_page_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_rich_text_path_idx\` ON \`front_page_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_rich_text_locale_idx\` ON \`front_page_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_dynamic_list_collections\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`front_page_blocks_dynamic_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_collections_order_idx\` ON \`front_page_blocks_dynamic_list_collections\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_collections_parent_idx\` ON \`front_page_blocks_dynamic_list_collections\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_collections_locale_idx\` ON \`front_page_blocks_dynamic_list_collections\` (\`locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_dynamic_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page_blocks_dynamic_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_items_order_idx\` ON \`front_page_blocks_dynamic_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_items_parent_id_idx\` ON \`front_page_blocks_dynamic_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_items_locale_idx\` ON \`front_page_blocks_dynamic_list_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_blocks_dynamic_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'fi',
  	\`sort_by\` text DEFAULT 'createdAt',
  	\`sort_order\` text DEFAULT 'desc',
  	\`limit\` numeric DEFAULT 3,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_order_idx\` ON \`front_page_blocks_dynamic_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_parent_id_idx\` ON \`front_page_blocks_dynamic_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_path_idx\` ON \`front_page_blocks_dynamic_list\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_blocks_dynamic_list_locale_idx\` ON \`front_page_blocks_dynamic_list\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page__status_idx\` ON \`front_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_locales\` (
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_meta_meta_image_idx\` ON \`front_page_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`front_page_locales_locale_parent_id_unique\` ON \`front_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`front_page_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locale\` text,
  	\`articles_id\` integer,
  	\`contacts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`front_page\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_rels_order_idx\` ON \`front_page_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_rels_parent_idx\` ON \`front_page_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_rels_path_idx\` ON \`front_page_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_rels_locale_idx\` ON \`front_page_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_rels_articles_id_idx\` ON \`front_page_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`front_page_rels_contacts_id_idx\` ON \`front_page_rels\` (\`contacts_id\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_version_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_version_hero_order_idx\` ON \`_front_page_v_version_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_version_hero_parent_id_idx\` ON \`_front_page_v_version_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_version_hero_locale_idx\` ON \`_front_page_v_version_hero\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_version_hero_image_idx\` ON \`_front_page_v_version_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_large_featured_post\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_large_featured_post_order_idx\` ON \`_front_page_v_blocks_large_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_large_featured_post_parent_id_idx\` ON \`_front_page_v_blocks_large_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_large_featured_post_path_idx\` ON \`_front_page_v_blocks_large_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_large_featured_post_locale_idx\` ON \`_front_page_v_blocks_large_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_large_featured_post_image_idx\` ON \`_front_page_v_blocks_large_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_small_featured_post\` (
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
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_post_order_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_post_parent_id_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_post_path_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_post_locale_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_post_image_idx\` ON \`_front_page_v_blocks_small_featured_post\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_small_featured_posts_wrapper\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_posts_wrapper_order_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_posts_wrapper_parent_id_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_posts_wrapper_path_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_small_featured_posts_wrapper_locale_idx\` ON \`_front_page_v_blocks_small_featured_posts_wrapper\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_carousel_items\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v_blocks_carousel\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_items_order_idx\` ON \`_front_page_v_blocks_carousel_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_items_parent_id_idx\` ON \`_front_page_v_blocks_carousel_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_items_locale_idx\` ON \`_front_page_v_blocks_carousel_items\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_items_image_idx\` ON \`_front_page_v_blocks_carousel_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_carousel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_order_idx\` ON \`_front_page_v_blocks_carousel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_parent_id_idx\` ON \`_front_page_v_blocks_carousel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_path_idx\` ON \`_front_page_v_blocks_carousel\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_carousel_locale_idx\` ON \`_front_page_v_blocks_carousel\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_link_list_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`is_external\` integer,
  	\`external_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v_blocks_link_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_links_order_idx\` ON \`_front_page_v_blocks_link_list_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_links_parent_id_idx\` ON \`_front_page_v_blocks_link_list_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_links_locale_idx\` ON \`_front_page_v_blocks_link_list_links\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_link_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_order_idx\` ON \`_front_page_v_blocks_link_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_parent_id_idx\` ON \`_front_page_v_blocks_link_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_path_idx\` ON \`_front_page_v_blocks_link_list\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_link_list_locale_idx\` ON \`_front_page_v_blocks_link_list\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_contacts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_contacts_order_idx\` ON \`_front_page_v_blocks_contacts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_contacts_parent_id_idx\` ON \`_front_page_v_blocks_contacts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_contacts_path_idx\` ON \`_front_page_v_blocks_contacts\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_contacts_locale_idx\` ON \`_front_page_v_blocks_contacts\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`author\` text,
  	\`title\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_quote_order_idx\` ON \`_front_page_v_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_quote_parent_id_idx\` ON \`_front_page_v_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_quote_path_idx\` ON \`_front_page_v_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_quote_locale_idx\` ON \`_front_page_v_blocks_quote\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_quote_image_idx\` ON \`_front_page_v_blocks_quote\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_rich_text_order_idx\` ON \`_front_page_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_rich_text_parent_id_idx\` ON \`_front_page_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_rich_text_path_idx\` ON \`_front_page_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_rich_text_locale_idx\` ON \`_front_page_v_blocks_rich_text\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_collections\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_front_page_v_blocks_dynamic_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_collections_order_idx\` ON \`_front_page_v_blocks_dynamic_list_collections\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_collections_parent_idx\` ON \`_front_page_v_blocks_dynamic_list_collections\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_collections_locale_idx\` ON \`_front_page_v_blocks_dynamic_list_collections\` (\`locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v_blocks_dynamic_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_items_order_idx\` ON \`_front_page_v_blocks_dynamic_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_items_parent_id_idx\` ON \`_front_page_v_blocks_dynamic_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_items_locale_idx\` ON \`_front_page_v_blocks_dynamic_list_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_blocks_dynamic_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`language\` text DEFAULT 'fi',
  	\`sort_by\` text DEFAULT 'createdAt',
  	\`sort_order\` text DEFAULT 'desc',
  	\`limit\` numeric DEFAULT 3,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_order_idx\` ON \`_front_page_v_blocks_dynamic_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_parent_id_idx\` ON \`_front_page_v_blocks_dynamic_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_path_idx\` ON \`_front_page_v_blocks_dynamic_list\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_blocks_dynamic_list_locale_idx\` ON \`_front_page_v_blocks_dynamic_list\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_version_version__status_idx\` ON \`_front_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_created_at_idx\` ON \`_front_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_updated_at_idx\` ON \`_front_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_snapshot_idx\` ON \`_front_page_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_published_locale_idx\` ON \`_front_page_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_latest_idx\` ON \`_front_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_locales\` (
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_version_meta_version_meta_image_idx\` ON \`_front_page_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_front_page_v_locales_locale_parent_id_unique\` ON \`_front_page_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_front_page_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locale\` text,
  	\`articles_id\` integer,
  	\`contacts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_front_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_rels_order_idx\` ON \`_front_page_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_rels_parent_idx\` ON \`_front_page_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_rels_path_idx\` ON \`_front_page_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_rels_locale_idx\` ON \`_front_page_v_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_rels_articles_id_idx\` ON \`_front_page_v_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_front_page_v_rels_contacts_id_idx\` ON \`_front_page_v_rels\` (\`contacts_id\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`main_menu_items_children_grandchildren\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu_items_children\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_children_grandchildren_order_idx\` ON \`main_menu_items_children_grandchildren\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_children_grandchildren_parent_id_idx\` ON \`main_menu_items_children_grandchildren\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_children_grandchildren_locale_idx\` ON \`main_menu_items_children_grandchildren\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`main_menu_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`add_links\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_children_order_idx\` ON \`main_menu_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_children_parent_id_idx\` ON \`main_menu_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_children_locale_idx\` ON \`main_menu_items_children\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`main_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`add_links\` integer,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_order_idx\` ON \`main_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_parent_id_idx\` ON \`main_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_items_locale_idx\` ON \`main_menu_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`main_menu\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`main_menu_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locale\` text,
  	\`articles_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_rels_order_idx\` ON \`main_menu_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_rels_parent_idx\` ON \`main_menu_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_rels_path_idx\` ON \`main_menu_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_rels_locale_idx\` ON \`main_menu_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`main_menu_rels_articles_id_idx\` ON \`main_menu_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_menu_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_label\` text,
  	\`link_is_external\` integer,
  	\`link_external_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_menu_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_items_children_order_idx\` ON \`footer_menu_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_items_children_parent_id_idx\` ON \`footer_menu_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_items_children_locale_idx\` ON \`footer_menu_items_children\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_items_order_idx\` ON \`footer_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_items_parent_id_idx\` ON \`footer_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_items_locale_idx\` ON \`footer_menu_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_menu\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_menu_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locale\` text,
  	\`articles_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`footer_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_rels_order_idx\` ON \`footer_menu_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_rels_parent_idx\` ON \`footer_menu_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_rels_path_idx\` ON \`footer_menu_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_rels_locale_idx\` ON \`footer_menu_rels\` (\`locale\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`footer_menu_rels_articles_id_idx\` ON \`footer_menu_rels\` (\`articles_id\`,\`locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`general_social_facebook\` text,
  	\`general_social_instagram\` text,
  	\`general_social_linkedin\` text,
  	\`general_social_youtube\` text,
  	\`contact_address\` text,
  	\`contact_postal_code\` text,
  	\`contact_city\` text,
  	\`contact_phone\` text,
  	\`contact_email\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`footer_locales\` (
  	\`general_title\` text,
  	\`general_description\` text,
  	\`copyright\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`footer_locales_locale_parent_id_unique\` ON \`footer_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_tabs_tabs\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_tabs\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_locales\`;`)
  await db.run(sql`DROP TABLE \`articles_rels\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_tabs_tabs\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_tabs\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`categories_locales\`;`)
  await db.run(sql`DROP TABLE \`contacts\`;`)
  await db.run(sql`DROP TABLE \`contacts_locales\`;`)
  await db.run(sql`DROP TABLE \`payload_folders_folder_type\`;`)
  await db.run(sql`DROP TABLE \`payload_folders\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`front_page_hero\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_large_featured_post\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_small_featured_post\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_small_featured_posts_wrapper\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_carousel_items\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_carousel\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_link_list_links\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_link_list\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_contacts\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_dynamic_list_collections\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_dynamic_list_items\`;`)
  await db.run(sql`DROP TABLE \`front_page_blocks_dynamic_list\`;`)
  await db.run(sql`DROP TABLE \`front_page\`;`)
  await db.run(sql`DROP TABLE \`front_page_locales\`;`)
  await db.run(sql`DROP TABLE \`front_page_rels\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_version_hero\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_large_featured_post\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_small_featured_post\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_small_featured_posts_wrapper\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_carousel_items\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_carousel\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_link_list_links\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_link_list\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_contacts\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_dynamic_list_collections\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_dynamic_list_items\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_blocks_dynamic_list\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_front_page_v_rels\`;`)
  await db.run(sql`DROP TABLE \`main_menu_items_children_grandchildren\`;`)
  await db.run(sql`DROP TABLE \`main_menu_items_children\`;`)
  await db.run(sql`DROP TABLE \`main_menu_items\`;`)
  await db.run(sql`DROP TABLE \`main_menu\`;`)
  await db.run(sql`DROP TABLE \`main_menu_rels\`;`)
  await db.run(sql`DROP TABLE \`footer_menu_items_children\`;`)
  await db.run(sql`DROP TABLE \`footer_menu_items\`;`)
  await db.run(sql`DROP TABLE \`footer_menu\`;`)
  await db.run(sql`DROP TABLE \`footer_menu_rels\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer_locales\`;`)
}
