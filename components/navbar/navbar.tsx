'use client';

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import ThemeToggle from "../theme-toggle";
import { LanguageSwitcher } from "../language-switcher";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const Navbar = () => {
  const { t } = useLanguage();
  
  return (
    <nav className="fixed z-10 top-2 sm:top-4 inset-x-2 sm:inset-x-4 h-14 xs:h-16 bg-background/50 backdrop-blur-sm border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-2 sm:px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          
          <Button variant="outline" className="hidden sm:inline-flex text-xs sm:text-sm" asChild>
            <Link href="/login">{t('auth.login')}</Link>
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex text-xs sm:text-sm" asChild>
            <Link href="/admin-signup">{t('users.admin')}</Link>
          </Button>
          <Button className="hidden xs:inline-flex text-xs sm:text-sm" asChild>
            <Link href="/signup">{t('auth.createAccount')}</Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
