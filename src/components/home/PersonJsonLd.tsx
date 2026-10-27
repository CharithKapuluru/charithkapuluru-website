export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Charith Kapuluru",
    url: "https://charithkapuluru.com",
    jobTitle: "Cloud and DevOps Engineer",
    email: "mailto:kapulurucharith@gmail.com",
    sameAs: ["https://github.com/CharithKapuluru", "https://www.linkedin.com/in/charith-kapuluru-159456329/"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
