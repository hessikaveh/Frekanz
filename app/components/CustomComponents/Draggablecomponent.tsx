import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  UniqueIdentifier,
  useDraggable,
  DragOverEvent,
} from "@dnd-kit/core";

import { Droppable, Draggable, DraggableOverlay } from "..";
import dynamic from "next/dynamic";

const DraggableOverlaytWithNoSSR = dynamic(
  () => Promise.resolve(DraggableOverlay),
  {
    ssr: false,
  }
);
type DraggableComponentProps = {
  containers: string[]; // Annotate the type of 'containers' as an array of strings
  draggableItems: any[]; // Adjust the type according to your data structure
  sentence: string;
  word: string;
};

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  containers,
  draggableItems,
  sentence,
  word,
}) => {
  const colors = ["bg-success", "bg-orange-100"];
  const [isDragging, setIsDragging] = useState(false);
  const [highlight, setHighlight] = useState<string>(colors[1]);

  const draggableComponents = draggableItems.map((item) => (
    <DraggableItem
      key={item.id_outer}
      label={item.label}
      id_outer={item.id_outer}
    />
  ));

  const idOuterValues = draggableComponents.map(
    (component) => component.props.id_outer
  );
  const inputLength = idOuterValues.length;
  const parentStates = Array.from({ length: inputLength }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<UniqueIdentifier | null>(null)
  );

  const parents = parentStates.map(([parent]) => parent);
  const parentSetters = parentStates.map(([_, setParent]) => setParent);
  const dropTargets = parents;
  const dropTargetsSet = parentSetters;

  useEffect(() => {
    setBoxHighlight();
  }, [parents, setBoxHighlight]);

  interface DraggableProps {
    label?: string;
    id_outer: UniqueIdentifier;
  }
  function DraggableItem({ label, id_outer }: DraggableProps) {
    const { isDragging, setNodeRef, listeners } = useDraggable({
      id: id_outer,
    });
    return (
      <Draggable
        dragging={isDragging}
        ref={setNodeRef}
        listeners={listeners}
        label={label}
        handle={false}
        style={{
          opacity: isDragging ? 0 : undefined,
        }}
      />
    );
  }
  function handleDragEnd(event: DragOverEvent) {
    const { over, active } = event;
    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    for (let i = 0; i < idOuterValues.length; i++) {
      if (active.id === idOuterValues[i]) {
        dropTargetsSet[i](
          over && active.id === idOuterValues[i] ? over.id : null
        );
        break; // exit loop once parent is assigned
      }
    }
  }

  function droppableSet(id: string, dragging: boolean) {
    const idOuterValues = draggableComponents.map(
      (component) => component.props.id_outer
    );

    return (
      <Droppable key={id} id={id} dragging={dragging}>
        {draggableComponents.map((component, index) => {
          if (
            dropTargets[index] === id &&
            component.props.id_outer === idOuterValues[index]
          ) {
            return component;
          } else {
            return null;
          }
        })}
        {dropTargets.includes(id) ? null : (
          <span className="text-sm">drop zone</span>
        )}
      </Droppable>
    );
  }

  function setBoxHighlight() {
    if (parents.toString() === idOuterValues.toString()) {
      setHighlight(colors[0]);
    } else {
      setHighlight(colors[1]);
    }
  }
  // Shuffle function
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffled indices
  const shuffledIndices = useMemo(
    () => shuffleArray([...Array(draggableComponents.length).keys()]),
    []
  );

  return (
    <DndContext
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col ">
        <div>
          <p className="mx-2 text-center font-black text-xl">{word}</p>
          <p className="mx-2 font-bold">{sentence}</p>
        </div>
        <div className="divider divider-vertical "></div>

        <p className="mx-2 font-bold text-center">
          Drag to complete the translation:
        </p>
        <div className={`${highlight}`} style={{ backgroundColor: highlight }}>
          <div className="flex justify-around flex-wrap m-3">
            {shuffledIndices.map((index) => {
              const component = draggableComponents[index];
              if (
                dropTargets[index] === null &&
                component.props.id_outer === idOuterValues[index]
              ) {
                return component;
              } else {
                return null;
              }
            })}
          </div>
        </div>

        <div className="flex justify-around flex-wrap m-3 ">
          {containers.map((container, index) => (
            <div key={index}>{droppableSet(container, isDragging)}</div>
          ))}
        </div>
      </div>

      <DraggableOverlaytWithNoSSR />
    </DndContext>
  );
};

export default DraggableComponent;
