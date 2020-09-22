import React from "react";
import { DropTarget } from "react-dnd";
import { Transition } from "react-spring/renderprops";
import DraggableCard from "./Card";
import { ItemTypes } from "./ItemTypes";
import "./style.css";

const ITEMS = [
  {
    id: 1,
    text: "Write a cool JS",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  {
    id: 2,
    text: "Make it generic",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
  },
  {
    id: 3,
    text: "Write README",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
  },
  {
    id: 4,
    text: "examples",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: 5,
    text: "Spam in Twitter",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
  },
  {
    id: 6,
    text: "???",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
  },
  {
    id: 7,
    text: "PROFIT",
    height: 80,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)"
  }
];

const spec = {};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class DroppableList extends React.Component {
  state = {
    cards: ITEMS,
  }

  moveCard = (id, atIndex) => {
    const { index } = this.findCard(id);
    this.setState(state => {
      const { cards } = state;
      [cards[atIndex], cards[index]] = [cards[index], cards[atIndex]];

      return { cards: [...cards] };
    })
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
                transform={y.interpolate((y) => `translate3d(0,${y}px, 0)`)}
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
