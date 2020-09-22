import React from "react";
import { DragSource, DropTarget, useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { animated } from "react-spring/renderprops";
// const style = {
//   cursor: "move",
//   position: "absolute",
//   willChange: "transform, height, opacity",
//   width: "100%"
// };

class DraggableCard extends React.Component {
  nodeRef = React.createRef()

  setRef = node => {
    const { connectDragSource, connectDropTarget } = this.props;
    this.nodeRef.current = node;
    connectDragSource(connectDropTarget(this.nodeRef));
  }

  render() {
    const { data, opacity, height, transform, isDragging } = this.props;
    const style = {
      cursor: "move",
      position: "absolute",
      willChange: "transform, height, opacity",
      width: "100%"
    };

    return (
      <animated.div ref={this.setRef} style={{ ...style, opacity: isDragging ? 0 : opacity, height, transform }}>
        <div className="main-list-cell">
          <div className="main-list-details" style={{ backgroundImage: data.css }}>
            <h1>{data.text}</h1>
          </div>
        </div>
      </animated.div>
    );
  }
}

export default DragSource(
  ItemTypes.CARD, {
    beginDrag(props) {
      const { data, findCard } = props;

      return {
        type: ItemTypes.CARD,
        id: data.id,
        originalIndex: findCard(data.id).index,
      };
    }
  }, (connect, monitor) => ({
    isDragging: monitor.isDragging(),
    connectDragSource: connect.dragSource(),
  }),
)(
  DropTarget(
    ItemTypes.CARD, {
      canDrop: () => false,
      hover(props, monitor, component) {
        const { findCard, moveCard, data } = props;
        const item = monitor.getItem();
        const hoverIndex = findCard(data.id).index;
        const dragIndex = findCard(item.id).index;

        if (dragIndex === hoverIndex) {
          return;
        }
        const { nodeRef } = component;
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
  }, connect => ({
    connectDropTarget: connect.dropTarget(),
  }))
(DraggableCard));
