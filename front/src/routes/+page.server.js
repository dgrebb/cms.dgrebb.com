import {
  PUBLIC_API_PATH_HOME as HOME,
  PUBLIC_API_URL as URL,
} from "$env/static/public";
import api from "@api";
import { error } from "@sveltejs/kit";

const endpoint = URL + HOME;

export async function load({ params }) {
  let seo, bioPicture, headline, image, intro, links;
  const home = await api(endpoint);

  if (!home) {
    throw error(500, "Home Page Error");
  }

  ({ seo, bioPicture, headline, image, intro, links } = home);

  image = { ...bioPicture.data?.attributes } || {
    url: "/bio.jpg",
    alternativeText: "A picture of Dan smiling",
  };

  const page = {
    headline,
    image,
    intro,
    links,
  };
  var pageMeta = {
    ...seo,
    type: "website",
  };

  /**
   * Isolates the `metaImage` object properties we care about
   */
  pageMeta.metaImage = pageMeta?.metaImage?.data?.attributes || image;

  return {
    ...page,
    pageMeta,
  };
}
