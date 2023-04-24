import { ImageFormatter } from "../components/Formatters/ImageFormatter";
export default function ImageViewer({ row, column }) {
  return <ImageFormatter value={row[column.key]} />;
}
