import React, { useRef, useEffect } from "react";

export default function useDragScroll() {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      el.classList.add("cursor-grabbing");
      // Fare pozisyonunu container solundan göre al
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeaveOrUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;

      const x = e.pageX - el.offsetLeft;
      const walk = x - startX; // ne kadar kaydırdığını hesapla
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseLeaveOrUp);
    el.addEventListener("mouseleave", onMouseLeaveOrUp);
    el.addEventListener("mousemove", onMouseMove);

    // Cleanup
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseLeaveOrUp);
      el.removeEventListener("mouseleave", onMouseLeaveOrUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return ref;
}
