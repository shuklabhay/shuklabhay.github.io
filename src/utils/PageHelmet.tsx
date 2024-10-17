import { Helmet } from "react-helmet-async";

export default function PageHelmet({
  description,
  page,
}: {
  description: string;
  page: "/" | "/plaintext";
}) {
  return (
    <Helmet>
      <title>Abhay Shukla</title>

      <meta property="og:title" content="Abhay Shukla" />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content="https://raw.githubusercontent.com/shuklabhay/shuklabhay.github.io/main/public/main_photo.png"
      />
      <meta property="og:url" content={`https://shuklabhay.github.io${page}`} />
    </Helmet>
  );
}
