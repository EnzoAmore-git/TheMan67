import { initNavigation } from "./navigation.js";
import { initGallery } from "./gallery.js";
import { initMotion } from "./motion.js";
import { initAnalytics } from "./analytics.js";
initNavigation();
initGallery();
initMotion();
if ("requestIdleCallback" in window)
  requestIdleCallback(initAnalytics, { timeout: 4000 });
else setTimeout(initAnalytics, 2000);
