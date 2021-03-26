import Roadmap from "components/roadmap";
import GlobalLayout from "layouts/global.layout";
import { serverSideTranslationsProps } from "lib/server-side-translation";

export const getStaticProps = serverSideTranslationsProps(["common", "footer"]);

export default function RoadmapPage() {
  return (
    <GlobalLayout>
      <Roadmap />
    </GlobalLayout>
  );
}
