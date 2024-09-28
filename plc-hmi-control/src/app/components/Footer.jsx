import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>Juan Esteban Armas ⓒ {currentYear}</p>
    </footer>
  );
}

export default Footer;
