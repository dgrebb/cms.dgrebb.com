import fetchContent from "../_utils/fetch-content";
import NavBar from "./NavBar";
import NavHome from "./NavHome";

const navigationAPI = `${process.env.API_URL}/navigation`;

export default async function Header() {
  const navContent = await fetchContent(`${navigationAPI}?populate=*`);
  const { navHeading, navItems } = navContent.attributes;

  return (
    <header className="header flex items-center">
      <div className="title flex flex-grow">
        <NavHome navHeading={navHeading} />
      </div>
      {navItems.length ? <NavBar navItems={navItems} /> : null}
    </header>
  );
}
