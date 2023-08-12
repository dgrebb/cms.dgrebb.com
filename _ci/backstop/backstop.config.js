const { ID, refDir, allViewports } = require('./scenarios/vars.js');
const { homepage, privacy, posts, post, cats } = require('./scenarios');

let scenarios = [
  homepage.homepage_default,
  homepage.theme_switch,
  privacy.privacy_default,
  posts.posts_navigate_from_home,
  posts.posts_hover_post_1,
  posts.posts_hover_post_7,
  post.post_navigate_from_posts,
  post.post_aside_toc_click,
  post.post_aside_toc_active,
  post.post_mobile_mininav_expand,
  post.post_mobile_mininav_expand_toc_active,
  cats.cats_mobile,
  cats.cats_navigate_from_post,
  cats.cats_mobile_select_tests_category,
  cats.cats_mobile_mini_nav_active,
  cats.cats_select_tests_category,
];

if (process.env.ENVIRONMENT === 'production') {
  scenarios = [
    homepage.homepage_default,
    homepage.theme_switch,
    privacy.privacy_default,
  ];
}

module.exports = {
  id: ID,
  viewports: allViewports,
  onReadyScript: 'playwright/onReady.js',
  scenarios,
  paths: {
    bitmaps_reference: `bd/bitmaps_reference/${refDir}`,
    bitmaps_test: `bd/bitmaps_test/${refDir}`,
    engine_scripts: 'bd/engine_scripts',
    html_report: 'bd/html_report',
    ci_report: 'bd/ci_report',
  },
  report: [],
  engine: 'playwright',
  engineOptions: {
    args: [],
    headless: true,
  },
  asyncCaptureLimit: 15,
  asyncCompareLimit: 100,
  debug: false,
  debugWindow: false,
  scenarioLogsInReports: true,
};
