import { PATHS } from '$lib/CONSTANTS';
const website = 'https://www.dgrebb.com';
const path = PATHS.one.post;
const feedTitle = 'Dan Grebb | Computer Programmer';
const feedDescription = 'Thoughts, learnings, and updates from Dan Grebb.';
const feedLink = 'https://www.dgrebb.com';
const feedUpdated = new Date();

export const xml = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
    <channel xmlns="http://www.w3.org/2005/Atom">
      <title>${feedTitle}</title>
      <link href="${feedLink}/RSS.xml" rel="self"/>
      <link href="${feedLink}"/>
      <id>${feedLink}/</id>
      <updated>${feedUpdated.toISOString()}</updated>
      <author>
        <name>Dan Grebb</name>
      </author>
      <subtitle>${feedDescription}</subtitle>
      <generator>JavaScript</generator>
  ${posts
    .map((post) => {
      const { slug, publishedAt, summary } = post.attributes;

      const image =
          post?.attributes?.hero?.data?.attributes?.formats?.small?.url ||
          false,
        thumbnail =
          post?.attributes?.hero?.data?.attributes?.formats?.thumbnail?.url ||
          false,
        imageMIME = post?.attributes?.hero?.data?.attributes?.mime || false,
        imageAlt =
          post?.attributes?.hero?.data?.attributes.alternativeText || false;

      return `<item>
          <title>${post.attributes.title.replace('&', '&amp;')}</title>
          <link href="${website}${path}/${slug}/"/>
          <id>${website}${path}/${slug}/</id>
          <updated>${new Date(publishedAt).toISOString()}</updated>
          <published>${new Date(publishedAt).toISOString()}</published>
          ${
            summary &&
            `
              <description>
                <![CDATA[
                  <div style="text-align: center;">
                    <img src="${image}" alt="${imageAlt}" style="display: inline-block;" />
                  </div>
                  <p>${summary}</p>
                ]]>
              </description>`
          }
          ${thumbnail && `<enclosure url="${thumbnail}" type="${imageMIME}" />`}
        </item>`;
    })
    .join('\n')}
  </channel>
  </rss>
`;
