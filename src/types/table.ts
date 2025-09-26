import type { SerializedElementNode } from "@payloadcms/richtext-lexical/lexical";

/**
 * Table-related type definitions for PayloadCMS EXPERIMENTAL_TableFeature
 *
 * These types define the structure of table nodes in Lexical rich text editor.
 * Used for rendering tables with proper TypeScript support.
 */

/**
 * Main table container node
 */
export type TableNode = SerializedElementNode & {
  type: "table";
  colWidths?: number[];
};

/**
 * Table row node
 */
export type TableRowNode = SerializedElementNode & {
  type: "tablerow";
  height?: number;
};

/**
 * Table cell node
 *
 * @param headerState - Determines if cell is a header (1) or regular cell (0)
 * @param colSpan - Number of columns the cell spans
 * @param rowSpan - Number of rows the cell spans
 * @param backgroundColor - Optional background color for the cell
 */
export type TableCellNode = SerializedElementNode & {
  type: "tablecell";
  colSpan?: number;
  rowSpan?: number;
  headerState?: number;
  backgroundColor?: string | null;
};

/**
 * Union type of all table-related nodes
 */
export type TableNodeTypes = TableNode | TableRowNode | TableCellNode;
