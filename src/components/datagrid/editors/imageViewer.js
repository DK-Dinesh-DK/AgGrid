import { ImageFormatter } from "../formatters";
export default function ImageViewer({ row, column }) {
  return <ImageFormatter value={row[column.key]} />;
}
