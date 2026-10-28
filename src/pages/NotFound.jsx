import { Link } from "react-router-dom";
import { PageHead } from "../components/ui";

export default function NotFound() {
  return (
    <div className="wrap">
      <PageHead eyebrow="404" title="Page not found" lede="That page doesn't exist. It may have moved, or the link may be wrong." />
      <p className="back-link">
        <Link className="btn solid" to="/">Back to home</Link>
      </p>
    </div>
  );
}
