import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Transition } from "react-spring/renderprops";
import { Card } from "./Card";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";
import "./style.css";

const ITEMS = [
  {
    id: 1,
    text: "Write a cool JS library",
    height: 130,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  {
    id: 2,
    text: "Make it generic enough",
    height: 160,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
  },
  {
    id: 3,
    text: "Write README",
    height: 300,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
  },
  {
    id: 4,
    text: "Create some examples",
    height: 150,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: 5,
    text: "Spam in Twitter and IRC to promote it",
    height: 200,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
  },
  {
    id: 6,
    text: "???",
    height: 150,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
  },
  {
    id: 7,
    text: "PROFIT",
    height: 150,
    description: "#a8edea → #fed6e3",
    css: "linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)"
  }
];
export const Container = () => {
  const [cards, setCards] = useState(ITEMS);
  const moveCard = (id, atIndex) => {
    const { card, index } = findCard(id);
    setCards(
      update(cards, {
        $splice: [
          [index, 1],
          [atIndex, 0, card]
        ]
      })
    );
  };
  const findCard = (id) => {
    const card = cards.filter((c) => c.id === id)[0];
    return {
      card,
      index: cards.indexOf(card)
    };
  };
  const [, drop] = useDrop({ accept: ItemTypes.CARD });
  let totalHeight = 0;
  const displayData = cards.map((card) => {
    let y = totalHeight;
    const height = card.height;
    totalHeight += card.height;

    return { y, height, child: card, key: card.id };
  });
  return (
    <>
      <div ref={drop} className="main-list">
        <Transition
          native
          items={displayData}
          keys={(d) => d.key}
          initial={null}
          from={{ height: 0, opacity: 0, scale: 1 }}
          leave={{ height: 0, opacity: 0 }}
          enter={({ y, height }) => ({ y, height, opacity: 1 })}
          update={({ y, height }) => ({ y, height, scale: 1 })}
          config={{ mass: 4, tension: 100, friction: 40 }}
          trail={100}
        >
          {(item, s, i) => props => {
            const { child } = item;
            const { opacity, y, height } = props;
            console.log(item, props);
            return (
              <Card
                id={child.id}
                data={child}
                moveCard={moveCard}
                findCard={findCard}
                opacity={opacity}
                height={height}
                zIndex={displayData.length - i}
                transform={y.interpolate((y) => `translate3d(0,${y}px, 0)`)}
              />
            )
          }}
        </Transition>
      </div>
    </>
  );
};
