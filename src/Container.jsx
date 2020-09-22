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
  }

  moveCard = (id, atIndex) => {
    const { index } = this.findCard(id);
    this.setState(state => {
      const { cards } = state;
      const moveCard = cards[index];
      cards[index] = undefined;
      const newCards = cards.filter(card => card !== undefined);
      newCards.splice(atIndex, 0, moveCard);

      return { cards: newCards };
    });
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
    const { cards } = this.state;

    let totalHeight = 0;
    const displayData = cards.map((card) => {
      let y = totalHeight;
      const height = card.height;
      totalHeight += card.height;
  
      return { y, height, cardData: card };
    });

    return connectDropTarget(
      <div className="main-list">
        <Transition
          native
          items={displayData}
          keys={({ cardData }) => cardData.id}
          initial={null}
          from={{ height: 0, opacity: 0, scale: 1 }}
          leave={{ height: 0, opacity: 0 }}
          enter={({ y, height }) => ({ y, height, opacity: 1 })}
          update={({ y, height }) => ({ y, height, scale: 1 })}
        >
          {item => props => {
            const { cardData } = item;
            const { opacity, y, height } = props;

            return (
              <DraggableCard
                key={cardData.id}
                data={cardData}
                moveCard={this.moveCard}
                findCard={this.findCard}
                opacity={opacity}
                height={height}
                transform={y.interpolate(y => `translate3d(0,${y}px, 0)`)}
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
