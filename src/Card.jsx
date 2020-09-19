import React from "react";
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
  id,
  data,
  moveCard,
  findCard,
  opacity,
  height,
  zIndex,
  transform
}) => {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, originalIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (dropResult, monitor) => {
      // const { id: droppedId, originalIndex } = monitor.getItem();
      // const didDrop = monitor.didDrop();
      // if (!didDrop) {
      //   moveCard(droppedId, originalIndex);
      // }
    }
  });
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => false,
    hover({ id: draggedId }) {
      if (draggedId !== id) {
        const { index: overIndex } = findCard(id);
        moveCard(draggedId, overIndex);
      }
    }
  });

  return (
    <animated.div
      ref={(node) => drag(drop(node))}
      style={{ ...style, opacity, height, zIndex, transform }}
    >
      <div className="main-list-cell">
        <div
          className="main-list-details"
          style={{ backgroundImage: data.css }}
        >
          <h1>{data.text}</h1>
          <p>{data.description}</p>
        </div>
      </div>
    </animated.div>
  );
};
