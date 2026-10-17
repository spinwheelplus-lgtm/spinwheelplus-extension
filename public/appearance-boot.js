(function () {
  try {
    var key = "spinwheelplus.appearance";
    var raw = localStorage.getItem(key);
    var pref =
      raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
    var dark =
      pref === "dark" ||
      (pref !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
