
export function scrollIntoView(element) {
  if (element && typeof element.scrollIntoView === "function") {
    element.scrollIntoView({ inline: "nearest", block: "nearest" });
  }
}


