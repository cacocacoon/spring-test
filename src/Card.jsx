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
    const { data, opacity, height, y } = this.props;
    const transform = y.interpolate(y => `translate3d(0,${y}px, 0)`);

    const style = {
      opacity,
      height,
      transform
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
      const { data, findCard } = props;

      return {
        type: ItemTypes.CARD,
        id: data.id,
        originalIndex: findCard(data.id).index,
      };
    }
  }, connect => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
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
