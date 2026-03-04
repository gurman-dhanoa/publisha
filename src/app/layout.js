import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import HeroUI from "@/components/shared/HeroUI";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/components/shared/ReduxProvider";
import AuthInitializer from "@/components/shared/AuthInitializer";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

// Configure the Sans-Serif font (Body/UI)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Expose as a CSS variable
});

// Configure the Serif font (Headings)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair", // Expose as a CSS variable
});

export const metadata = {
  title: "Publisha | Write. Enhance. Publish.",
  description:
    "A distraction-free platform powered by next-gen AI. From first draft to final polish, create impactful content and build your following in the AI age.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="L2F6IWJUva8NDaGVoGVhmqfVRLaMQjENKjioawy_JFE"
        />
        <script id="gtm-script">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5H7MN7DV');
          `}
        </script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5H7MN7DV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <ReduxProvider>
          <ThemeProvider>
            <HeroUI>
              <AuthInitializer>
                <Navbar />
                {children}
                <Footer />
              </AuthInitializer>
              <Toaster />
            </HeroUI>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
