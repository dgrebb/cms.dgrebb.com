import { marked } from 'marked';
import { link, heading } from '@components/content/renderers';
import {
  PUBLIC_API_PATH_CV_PAGE as CV,
  PUBLIC_API_CV_PATH_LANDING_EXPERIENCE_LISTING as EX,
  PUBLIC_API_URL as URL,
} from '$env/static/public';
import api from '@api';
import { error } from '@sveltejs/kit';

const endpoint = URL + CV;
const experiencesEndpoint = URL + EX;

function structureExperiences(data) {
  const orderedExperiences = data.sort((a, b) => {
    const startDateA = new Date(a.attributes.startDate).getTime();
    const startDateB = new Date(b.attributes.startDate).getTime();

    if (a.attributes.endDate === null && b.attributes.endDate !== null) {
      return -1; // Move item with null endDate to the front
    } else if (a.attributes.endDate !== null && b.attributes.endDate === null) {
      return 1; // Move item with null endDate to the front
    } else {
      // Sort by startDate for other cases (descending order)
      return startDateB - startDateA || 0;
    }
  });

  var reducedExperiences = [];
  orderedExperiences.map((experience) => {
    let pos = {
      ...experience.attributes,
      skills: experience.attributes.skills.data,
      organizations: experience.attributes.organizations.data,
      projects: experience.attributes.projects.data,
      industries: experience.attributes.industries.data,
      awards: experience.attributes.awards.data,
    };
    reducedExperiences.push(pos);
  });
  return reducedExperiences;
}

export async function load() {
  const renderer = new marked.Renderer();
  renderer.link = link;
  renderer.heading = heading;
  marked.use({ renderer });

  var cv, experiencesData;
  let updatedAt, publishedAt, seo, hero, summary, title, intro;

  try {
    cv = await api(endpoint);
    experiencesData = await api(experiencesEndpoint);
  } catch (error) {
    console.warn('CV page API error.');
    console.error(error);
  }

  if (!cv) {
    throw error(500, 'CV Page Error');
  }

  if (!experiencesData) {
    throw error(500, 'Experiences error on CV Page');
  }

  ({
    seo,
    content: {
      updatedAt,
      publishedAt,
      hero,
      summary,
      title,
      introduction: intro,
    },
  } = cv);

  const page = {
    title,
    intro: marked.parse(intro),
    hero: hero?.data?.attributes || false,
  };

  const experiences = structureExperiences(experiencesData);

  const pageMeta = {
    ...seo,
    updatedAt,
    publishedAt,
    type: 'article',
    metaTitle: `Resume « Dan Grebb`,
    socialTitle: `Resume « Dan Grebb`,
    titleTemplate: '%s « Skills « Dan Grebb',
    metaDescription:
      seo?.metaDescription ||
      summary ||
      "Dan Grebb's Resume. A collection of professional experiences, awards, projects, and skills collected since 1999.",
  };

  /**
   * Isolates the `metaImage` object properties we care about
   */
  pageMeta.metaImage =
    pageMeta?.metaImage?.data?.attributes || hero?.data?.attributes || false;

  return {
    page,
    experiences,
    pageMeta,
  };
}
