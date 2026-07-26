// Plainly Medicine — optional extra reader settings
// Load this file after app.js.

(function () {
  "use strict";

  var root = document.documentElement;
  var panel = document.getElementById("menu-settings");
  if (!panel) return;

  var keys = {
    width: "pm.extra.width",
    leading: "pm.extra.leading",
    font: "pm.extra.font",
    contrast: "pm.extra.contrast",
    progress: "pm.extra.progress",
    toc: "pm.extra.toc"
  };

  var defaults = {
    width: "default",
    leading: "default",
    font: "sans",
    contrast: "off",
    progress: "off",
    toc: "off"
  };

  function read(key) {
    try { return localStorage.getItem(keys[key]) || defaults[key]; }
    catch (error) { return defaults[key]; }
  }

  function write(key, value) {
    try { localStorage.setItem(keys[key], value); }
    catch (error) {}
  }

  var state = {
    width: read("width"),
    leading: read("leading"),
    font: read("font"),
    contrast: read("contrast"),
    progress: read("progress"),
    toc: read("toc")
  };

  function apply(key, value) {
    root.setAttribute("data-pmx-" + key, value);
    document.dispatchEvent(new CustomEvent("pmx:change", {
      detail: { key: key, value: value }
    }));
  }

  Object.keys(state).forEach(function (key) {
    apply(key, state[key]);
  });

  function row(label, control) {
    var wrapper = document.createElement("div");
    wrapper.className = "pmx-row";

    if (label) {
      var heading = document.createElement("span");
      heading.className = "pmx-label";
      heading.textContent = label;
      wrapper.appendChild(heading);
    }

    wrapper.appendChild(control);
    return wrapper;
  }

  function segmented(key, options) {
    var group = document.createElement("div");
    group.className = "pmx-seg";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", key);

    options.forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.setAttribute("data-value", option.value);
      button.setAttribute("aria-pressed", state[key] === option.value ? "true" : "false");

      button.addEventListener("click", function () {
        state[key] = option.value;
        write(key, option.value);
        apply(key, option.value);

        group.querySelectorAll("button").forEach(function (other) {
          other.setAttribute("aria-pressed", other === button ? "true" : "false");
        });
      });

      group.appendChild(button);
    });

    return group;
  }

  function toggle(key, label) {
    var line = document.createElement("div");
    line.className = "pmx-toggle-row";

    var name = document.createElement("span");
    name.className = "pmx-toggle-name";
    name.textContent = label;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "pmx-switch";
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", state[key] === "on" ? "true" : "false");

    button.addEventListener("click", function () {
      var next = button.getAttribute("aria-pressed") !== "true";
      state[key] = next ? "on" : "off";
      write(key, state[key]);
      apply(key, state[key]);
      button.setAttribute("aria-pressed", next ? "true" : "false");
    });

    line.appendChild(name);
    line.appendChild(button);
    return line;
  }

  panel.appendChild(row("Reading width", segmented("width", [
    { label: "Narrow", value: "narrow" },
    { label: "Default", value: "default" },
    { label: "Wide", value: "wide" }
  ])));

  panel.appendChild(row("Line spacing", segmented("leading", [
    { label: "Compact", value: "compact" },
    { label: "Default", value: "default" },
    { label: "Relaxed", value: "relaxed" }
  ])));

  panel.appendChild(row("Article font", segmented("font", [
    { label: "Sans", value: "sans" },
    { label: "Serif", value: "serif" }
  ])));

  panel.appendChild(row("", toggle("contrast", "Higher contrast")));
  panel.appendChild(row("", toggle("progress", "Reading progress")));
  panel.appendChild(row("", toggle("toc", "Sticky contents")));

  var article = document.querySelector("article.article");

  if (article) {
    var progress = document.createElement("div");
    progress.className = "pmx-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = "<span></span>";
    document.body.appendChild(progress);

    var fill = progress.firstElementChild;
    var scheduled = false;

    function updateProgress() {
      scheduled = false;
      var rect = article.getBoundingClientRect();
      var articleTop = window.scrollY + rect.top;
      var distance = Math.max(1, article.offsetHeight - window.innerHeight);
      var amount = Math.min(1, Math.max(0, (window.scrollY - articleTop) / distance));
      fill.style.transform = "scaleX(" + amount + ")";
    }

    function requestProgress() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }

    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress);
    document.addEventListener("pmx:change", requestProgress);
    updateProgress();
  }

  var prose = article && article.querySelector(".prose");
  if (!prose) return;

  var headings = Array.prototype.slice.call(prose.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  function slug(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  }

  var used = {};

  headings.forEach(function (heading) {
    if (!heading.id) {
      var base = slug(heading.textContent);
      var candidate = base;
      var count = 2;

      while (used[candidate] || document.getElementById(candidate)) {
        candidate = base + "-" + count;
        count += 1;
      }

      heading.id = candidate;
    }

    used[heading.id] = true;
  });

  var toc = document.createElement("nav");
  toc.className = "pmx-toc";
  toc.setAttribute("aria-label", "Article contents");

  var title = document.createElement("div");
  title.className = "pmx-toc-title";
  title.textContent = "In this article";

  var list = document.createElement("ol");

  headings.forEach(function (heading) {
    var item = document.createElement("li");
    if (heading.tagName === "H3") item.className = "pmx-sub";

    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    link.setAttribute("data-target", heading.id);

    item.appendChild(link);
    list.appendChild(item);
  });

  toc.appendChild(title);
  toc.appendChild(list);
  article.parentNode.insertBefore(toc, article);

  if ("IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        links.forEach(function (link) {
          if (link.getAttribute("data-target") === entry.target.id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-18% 0px -70% 0px",
      threshold: 0
    });

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }
})();
