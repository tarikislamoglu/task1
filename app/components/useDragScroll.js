import { useRef, useEffect } from "react";

export default function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      slider.classList.add("cursor-grabbing");
      startX = e.clientX;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseUp = () => {
      isDragging = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.clientX;
      const walk = x - startX;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.style.cursor = "grab";

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mouseleave", onMouseUp);
    slider.addEventListener("mousemove", onMouseMove);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mouseleave", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return ref;
}
