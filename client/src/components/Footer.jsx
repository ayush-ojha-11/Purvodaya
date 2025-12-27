import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-12 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Purvodaya Energy Solutions
          </h2>
          <p className="text-sm leading-relaxed">
            Empowering the future with smart solar business management
            solutions.
            <br />
            <span className="text-xs text-gray-500">
              © {new Date().getFullYear()} Purvodaya Energy Solutions Inc. All
              rights reserved.
            </span>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link className="link link-hover" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/register">
                Register
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:purvodaya.es@gmail.com"
                className="link link-hover"
              >
                purvodaya.es@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+91-9519999640" className="link link-hover">
                +91-9876543210
              </a>
            </li>
            <li>
              <span className="block text-sm">
                209-X, Indraprasthpuram,Lane No.4, Gorakhpur, UP
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
