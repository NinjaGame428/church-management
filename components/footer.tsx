import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Fonctionnalités",
    href: "#features",
  },
  {
    title: "Tableaux de Bord",
    href: "#dashboards",
  },
  {
    title: "Confidentialité",
    href: "#privacy",
  },
];

const Footer = () => {
  return (
    <footer className="dark:border-t mt-40 dark bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary-foreground"
                >
                  <path
                    d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">ChurchManager</span>
            </div>

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-xs w-full">
            <h6 className="font-semibold">Restez informé</h6>
            <form className="mt-6 flex items-center gap-2">
              <Input type="email" placeholder="Votre email" />
              <Button>S'abonner</Button>
            </form>
          </div>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground text-center sm:text-start">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" target="_blank">
              ChurchManager
            </Link>
            . Tous droits réservés. Réalisé par{" "}
            <Link href="https://heavenkeys.ca" target="_blank" className="text-primary hover:underline">
              Heavenkeys LTD
            </Link>
            .
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <Link href="#" target="_blank">
              <TwitterIcon className="h-5 w-5" />
            </Link>
            <Link href="#" target="_blank">
              <DribbbleIcon className="h-5 w-5" />
            </Link>
            <Link href="#" target="_blank">
              <TwitchIcon className="h-5 w-5" />
            </Link>
            <Link href="#" target="_blank">
              <GithubIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
