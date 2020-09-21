import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { animated } from "react-spring/renderprops";
const style = {
  cursor: "move",
  position: "absolute",
  willChange: "transform, height, opacity",
  width: "100%"
};
export const Card = ({
  data,
  moveCard,
  findCard,
  opacity,
  height,
  zIndex,
  transform
}) => {
  const nodeRef = useRef();
  const originalIndex = findCard(data.id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id: data.id, originalIndex, data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
  });
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => false,
    hover(item, monitor) {
      const hoverIndex = findCard(data.id).index;
      const dragIndex = findCard(item.id).index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = nodeRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(item.id, hoverIndex);
      monitor.getItem().originalIndex = hoverIndex;
    }
  });

  drag(drop(nodeRef));

  return (
    <animated.div
      ref={nodeRef}
      style={{ ...style, opacity: isDragging ? 0 : opacity, height, zIndex, transform }}
    >
      <div className="main-list-cell">
        <div
          className="main-list-details"
          style={{ backgroundImage: data.css }}
        >
          <h1>{data.text}</h1>
        </div>
      </div>
    </animated.div>
  );
};
