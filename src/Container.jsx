import React from "react";
import { DropTarget } from "react-dnd";
import { Transition } from "react-spring/renderprops";
import DraggableCard from "./Card";
import { ItemTypes } from "./ItemTypes";
import items from './items';
import "./style.css";

const spec = {};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class DroppableList extends React.Component {
  state = {
    cards: items,
    onDraggingCardIndex: undefined,
  }

  moveCard = (id, atIndex) => {
    const { index } = this.findCard(id);
    this.setState(state => {
      const { cards } = state;
      const moveCard = cards[index];
      cards[index] = undefined;
      const newCards = cards.filter(card => card !== undefined);
      newCards.splice(atIndex, 0, moveCard);

      return { cards: newCards, onDraggingCardIndex: atIndex };
    });
  }

  handleStartMovingCard = id => {
    const { index } = this.findCard(id);
    this.setState({ onDraggingCardIndex: index });
  }

  handleDidMoveCard = () => {
    this.setState({ onDraggingCardIndex: undefined });
  }

  findCard = id => {
    const { cards } = this.state;
    const card = cards.filter((c) => c.id === id)[0];

    return {
      card,
      index: cards.indexOf(card)
    };
  };

  render() {
    const { connectDropTarget } = this.props;
    const { cards, onDraggingCardIndex } = this.state;

    let totalHeight = 0;
    const displayData = cards.map((card, index) => {
      const scale = index === onDraggingCardIndex ? 1.2 : 1;
      const y = totalHeight;
      const height = card.height;
      totalHeight += card.height;
  
      return { y, height, cardData: card, transform: [y, scale] };
    });

    return connectDropTarget(
      <div className="main-list">
        <Transition
          native
          items={displayData}
          keys={({ cardData }) => cardData.id}
          initial={null}
          from={{ height: 0, opacity: 0 }}
          leave={{ height: 0, opacity: 0 }}
          enter={({ height, transform }) => ({ transform, height, opacity: 1 })}
          update={({ height, transform }) => ({ height, transform })}
        >
          {item => props => {
            const { cardData } = item;
            const { opacity, height, transform } = props;

            return (
              <DraggableCard
                key={cardData.id}
                data={cardData}
                moveCard={this.moveCard}
                findCard={this.findCard}
                didMoveCard={this.handleDidMoveCard}
                startMovingCard={this.handleStartMovingCard}
                opacity={opacity}
                height={height}
                transform={transform.interpolate((height, scale) => `translate3d(0,${height}px, 0) scale(${scale})`)}
              />
            )
          }}
        </Transition>
      </div>
    );
  }
}

export default DropTarget(
  [ItemTypes.CARD],
  spec,
  collect
)(DroppableList);
