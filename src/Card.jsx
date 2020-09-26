import React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ItemTypes } from "./ItemTypes";
import { animated } from "react-spring/renderprops";

class DraggableCard extends React.Component {
  nodeRef = React.createRef()

  setRef = node => {
    const { connectDragSource, connectDropTarget, connectDragPreview } = this.props;
    this.nodeRef.current = node;
    connectDragSource(connectDropTarget(this.nodeRef));
    connectDragPreview(getEmptyImage());
  }

  render() {
    const { data, height, transform, isDragging } = this.props;
    let zIndex;

    if (isDragging) {
      zIndex = 1;
    }

    const style = {
      height,
      transform: transform.interpolate((y, scale) => `translate3d(0,${y}px, 0) scale(${scale})`),
      zIndex,
    };

    return (
      <animated.div className="main-list-cell" ref={this.setRef} style={style}>
        <div className="main-list-details" style={{ backgroundImage: data.css }}>
          <h1>{data.text}</h1>
        </div>
      </animated.div>
    );
  }
}

export default DragSource(
  ItemTypes.CARD, {
    beginDrag(props) {
      const { data, findCard, startMovingCard } = props;
      const originalIndex = findCard(data.id).index;
      startMovingCard(data.id);

      return {
        type: ItemTypes.CARD,
        id: data.id,
        originalIndex,
      };
    },
    endDrag(props) {
      const { didMoveCard } = props;
      didMoveCard();
    }
  }, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(
  DropTarget(
    ItemTypes.CARD, {
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
        const hoverY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 5;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverY * 4) {
          return;
        }

        moveCard(item.id, hoverIndex);
      }
  }, connect => ({
    connectDropTarget: connect.dropTarget(),
  }))
(DraggableCard));
