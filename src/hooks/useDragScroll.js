import { useRef } from "react";

const useDragScroll = () => {
  const ref = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    isDown = true;
    ref.current.classList.add("cursor-grabbing");
    startX = e.pageX - ref.current.offsetLeft;
    scrollLeft = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
    ref.current.classList.remove("cursor-grabbing");
  };

  const onMouseUp = () => {
    isDown = false;
    ref.current.classList.remove("cursor-grabbing");
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5; // velocidad
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
  };
};

export default useDragScroll;
