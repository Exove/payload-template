import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`buildings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`address_postal_code\` text,
  	\`build_year\` numeric,
  	\`renovation_year\` numeric,
  	\`collection\` text DEFAULT 'buildings',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`buildings_slug_idx\` ON \`buildings\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`buildings_updated_at_idx\` ON \`buildings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`buildings_created_at_idx\` ON \`buildings\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`buildings__status_idx\` ON \`buildings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`buildings_locales\` (
  	\`title\` text,
  	\`image_id\` integer,
  	\`description\` text,
  	\`address_street\` text,
  	\`address_city\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buildings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buildings_image_idx\` ON \`buildings_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`buildings_locales_locale_parent_id_unique\` ON \`buildings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`buildings_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`buildings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buildings_rels_order_idx\` ON \`buildings_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`buildings_rels_parent_idx\` ON \`buildings_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buildings_rels_path_idx\` ON \`buildings_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`buildings_rels_categories_id_idx\` ON \`buildings_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`_buildings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_address_postal_code\` text,
  	\`version_build_year\` numeric,
  	\`version_renovation_year\` numeric,
  	\`version_collection\` text DEFAULT 'buildings',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`buildings\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_buildings_v_parent_idx\` ON \`_buildings_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_version_version_slug_idx\` ON \`_buildings_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_version_version_updated_at_idx\` ON \`_buildings_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_version_version_created_at_idx\` ON \`_buildings_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_version_version__status_idx\` ON \`_buildings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_created_at_idx\` ON \`_buildings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_updated_at_idx\` ON \`_buildings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_snapshot_idx\` ON \`_buildings_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_published_locale_idx\` ON \`_buildings_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_latest_idx\` ON \`_buildings_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_buildings_v_locales\` (
  	\`version_title\` text,
  	\`version_image_id\` integer,
  	\`version_description\` text,
  	\`version_address_street\` text,
  	\`version_address_city\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buildings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buildings_v_version_version_image_idx\` ON \`_buildings_v_locales\` (\`version_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_buildings_v_locales_locale_parent_id_unique\` ON \`_buildings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_buildings_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_buildings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buildings_v_rels_order_idx\` ON \`_buildings_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_rels_parent_idx\` ON \`_buildings_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_rels_path_idx\` ON \`_buildings_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_buildings_v_rels_categories_id_idx\` ON \`_buildings_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`apartments_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`apartments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`apartments_features_order_idx\` ON \`apartments_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`apartments_features_parent_id_idx\` ON \`apartments_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`apartments_features_locale_idx\` ON \`apartments_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`apartments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`size\` numeric,
  	\`rooms\` numeric,
  	\`floor\` numeric,
  	\`price\` numeric,
  	\`status\` text DEFAULT 'available',
  	\`collection\` text DEFAULT 'apartments',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`apartments_slug_idx\` ON \`apartments\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`apartments_updated_at_idx\` ON \`apartments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`apartments_created_at_idx\` ON \`apartments\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`apartments__status_idx\` ON \`apartments\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`apartments_locales\` (
  	\`title\` text,
  	\`image_id\` integer,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`apartments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`apartments_image_idx\` ON \`apartments_locales\` (\`image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`apartments_locales_locale_parent_id_unique\` ON \`apartments_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`apartments_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`buildings_id\` integer,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`apartments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`buildings_id\`) REFERENCES \`buildings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`apartments_rels_order_idx\` ON \`apartments_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`apartments_rels_parent_idx\` ON \`apartments_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`apartments_rels_path_idx\` ON \`apartments_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`apartments_rels_buildings_id_idx\` ON \`apartments_rels\` (\`buildings_id\`);`)
  await db.run(sql`CREATE INDEX \`apartments_rels_categories_id_idx\` ON \`apartments_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`_apartments_v_version_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_apartments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_features_order_idx\` ON \`_apartments_v_version_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_features_parent_id_idx\` ON \`_apartments_v_version_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_features_locale_idx\` ON \`_apartments_v_version_features\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_apartments_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_size\` numeric,
  	\`version_rooms\` numeric,
  	\`version_floor\` numeric,
  	\`version_price\` numeric,
  	\`version_status\` text DEFAULT 'available',
  	\`version_collection\` text DEFAULT 'apartments',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`apartments\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_apartments_v_parent_idx\` ON \`_apartments_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_version_slug_idx\` ON \`_apartments_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_version_updated_at_idx\` ON \`_apartments_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_version_created_at_idx\` ON \`_apartments_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_version__status_idx\` ON \`_apartments_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_created_at_idx\` ON \`_apartments_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_updated_at_idx\` ON \`_apartments_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_snapshot_idx\` ON \`_apartments_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_published_locale_idx\` ON \`_apartments_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_latest_idx\` ON \`_apartments_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_apartments_v_locales\` (
  	\`version_title\` text,
  	\`version_image_id\` integer,
  	\`version_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_apartments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_apartments_v_version_version_image_idx\` ON \`_apartments_v_locales\` (\`version_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`_apartments_v_locales_locale_parent_id_unique\` ON \`_apartments_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_apartments_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`buildings_id\` integer,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_apartments_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`buildings_id\`) REFERENCES \`buildings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_apartments_v_rels_order_idx\` ON \`_apartments_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_rels_parent_idx\` ON \`_apartments_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_rels_path_idx\` ON \`_apartments_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_rels_buildings_id_idx\` ON \`_apartments_v_rels\` (\`buildings_id\`);`)
  await db.run(sql`CREATE INDEX \`_apartments_v_rels_categories_id_idx\` ON \`_apartments_v_rels\` (\`categories_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`buildings_id\` integer REFERENCES buildings(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`apartments_id\` integer REFERENCES apartments(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_buildings_id_idx\` ON \`payload_locked_documents_rels\` (\`buildings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_apartments_id_idx\` ON \`payload_locked_documents_rels\` (\`apartments_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`buildings\`;`)
  await db.run(sql`DROP TABLE \`buildings_locales\`;`)
  await db.run(sql`DROP TABLE \`buildings_rels\`;`)
  await db.run(sql`DROP TABLE \`_buildings_v\`;`)
  await db.run(sql`DROP TABLE \`_buildings_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_buildings_v_rels\`;`)
  await db.run(sql`DROP TABLE \`apartments_features\`;`)
  await db.run(sql`DROP TABLE \`apartments\`;`)
  await db.run(sql`DROP TABLE \`apartments_locales\`;`)
  await db.run(sql`DROP TABLE \`apartments_rels\`;`)
  await db.run(sql`DROP TABLE \`_apartments_v_version_features\`;`)
  await db.run(sql`DROP TABLE \`_apartments_v\`;`)
  await db.run(sql`DROP TABLE \`_apartments_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_apartments_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`articles_id\` integer,
  	\`collection_pages_id\` integer,
  	\`news_id\` integer,
  	\`categories_id\` integer,
  	\`contacts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`collection_pages_id\`) REFERENCES \`collection_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "articles_id", "collection_pages_id", "news_id", "categories_id", "contacts_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "articles_id", "collection_pages_id", "news_id", "categories_id", "contacts_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_collection_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`collection_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contacts_id_idx\` ON \`payload_locked_documents_rels\` (\`contacts_id\`);`)
}
