const { widget } = figma
const { useSyncedState, AutoLayout, Text, Input, Line } = widget

type permissionType = 'currentUser';

let today:any = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
let month = monthNames[today.getMonth()];
let currentUser:any = figma.currentUser?.name;

const Widget = () => {
  const [date, setDate] = useSyncedState("date", dd + '\n' + month);
  const [title, setTitle] = useSyncedState("title", "");
  const [first, setFirst] = useSyncedState("first", false);
  const [showChanges, setShowChanges] = useSyncedState("showChanges", false);
  const [changes, setChanges] = useSyncedState("changes", "");
  const [author, setAuthor] = useSyncedState("author", "");

  const updateChildren = (currentWidget:any, parentFrame:any) => {
    if (!parentFrame) {
      parentFrame = figma.createFrame();
      parentFrame.name = "Change Log";
      parentFrame.cornerRadius = 8;
      parentFrame.x = currentWidget[0].x - 64;
      parentFrame.y = currentWidget[0].y - 64;
      parentFrame.counterAxisSizingMode = 'AUTO';
      parentFrame.layoutMode = 'VERTICAL';
      parentFrame.itemSpacing = 24;
      parentFrame.itemReverseZIndex = false;
      parentFrame.paddingTop = 64;
      parentFrame.paddingLeft = 64;
      parentFrame.paddingBottom = 64;
      parentFrame.paddingRight = 64;
      const clone = (val:any) => {
        return JSON.parse(JSON.stringify(val))
      }
      const fills = clone(parentFrame.fills);
      fills[0].color = {r: 0.1525, g:0.17, b:0.185};
      parentFrame.fills = fills;
      figma.currentPage.insertChild(0, parentFrame);
    }
    for (const node in currentWidget) {
      if (currentWidget[node].parent === figma.currentPage) {
        if (!parentFrame) {
          updateChildren(currentWidget, parentFrame);
        }
        parentFrame.insertChild(0, currentWidget[node]);
      }
    }
  }

  const authorRecord = (e:any) => {
    if (e.characters !== '') {
      setAuthor('Recorded by ' + currentUser);
    }
  }

  const cloneWidget = () => {
    if (figma.widgetId) {
      let currentWidget = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId);
      let parentFrame = figma.currentPage.findAll(
        (n: { type: string; name: string; }) =>
          n.type === "FRAME" && n.name === 'Change Log'
      );
      for (const node in currentWidget) {
        if (node !== undefined) {
          currentWidget[node].cloneWidget({
            date: dd + '\n' + month,
            title: '',
            first: false,
            showChanges: false,
            changes: '',
            author: ''
          });
          currentWidget = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId);
          updateChildren(currentWidget, parentFrame[0]);
          break;
        }
      }
    }
  }

  return <AutoLayout
    name='Log Item'
    spacing={8}
    direction='vertical'
    width={612}
    height='hug-contents'
    fill='#33383D'
    cornerRadius={8}
  >
    <AutoLayout
      name='Header'
      padding={16}
      direction='horizontal'
      width='fill-parent'
      verticalAlignItems='center'
      spacing={16}
    >
      <Input
        value={date}
        inputBehavior='multiline'
        width={50}
        fill='#fff'
        fontSize={14}
        horizontalAlignText="center"
        onTextEditEnd={(e:any) =>{
          authorRecord(e);
          setDate(e.characters);
        }}
      />
      <Line
        stroke='#596269'
        length={40}
        rotation={90}
      />
      <Input
        value={title}
        placeholder="Changes"
        placeholderProps={{
          fill: '#fff'
        }}
        inputBehavior="wrap"
        fill='#fff'
        fontWeight='bold'
        width='fill-parent'
        fontSize={18}
        onTextEditEnd={(e:any) => {
          authorRecord(e);
          setTitle(e.characters);
        }}
      />
      { first ?
        <AutoLayout
          padding={{top: 8, left: 12, bottom: 8, right: 12}}
          height='hug-contents'
          fill='#272B2F'
          cornerRadius={32}
        >
          <Text
            fill='#E85954'
            onClick={() => {
              setFirst(false);
            }}
          >Removed</Text>
        </AutoLayout>
        : <AutoLayout
          padding={{top: 8, left: 12, bottom: 8, right: 12}}
          height='hug-contents'
          fill='#272B2F'
          cornerRadius={32}
        >
          <Text
            fill='#45E2DA'
            onClick={() => {
              setFirst(true);
            }}
          >Added</Text>
        </AutoLayout>
      }
    </AutoLayout>
    { showChanges ?
      <>
        <Line
          length='fill-parent'
          stroke='#596269'
        />
        <AutoLayout
          name='Changes'
          padding={16}
          direction='vertical'
          width='fill-parent'
          height='hug-contents'
          verticalAlignItems='center'
          spacing={16}
        >
          <Input
            value={changes}
            placeholder="Description of changes"
            placeholderProps={{
              fill: '#fff'
            }}
            inputBehavior="multiline"
            fill='#fff'
            width='fill-parent'
            fontSize={18}
            onTextEditEnd={(e:any) => {
              authorRecord(e);
              setChanges(e.characters);
            }}
          />
        </AutoLayout>
      </> : <></> }
    <Line
      length='fill-parent'
      stroke='#596269'
    />
    <AutoLayout
      name='Controls'
      padding={{top: 16, left: 24, bottom: 24, right: 16}}
      direction='horizontal'
      width='fill-parent'
      height='hug-contents'
      verticalAlignItems='center'
      spacing={16}
    >
      <AutoLayout
        name='New'
        direction='horizontal'
        width='fill-parent'
        height='hug-contents'
        verticalAlignItems='center'
        spacing={16}
      >
        <Text
          fill='#938CD9'
          textDecoration="underline"
          width='hug-contents'
          fontWeight='bold'
          hoverStyle={{
            fill: '#B0ACD6',
          }}
          onClick={() => {
            cloneWidget();
          }}
        >New Entry</Text>
        { showChanges ?
          <Text
            fill='#938CD9'
            textDecoration="underline"
            width='hug-contents'
            fontWeight='bold'
            hoverStyle={{
              fill: '#B0ACD6',
            }}
            onClick={() => {
              setShowChanges(false);
            }}
          >{changes ? `Hide Details` : `Remove Details`}</Text>
        :
          <Text
            fill='#938CD9'
            textDecoration="underline"
            width='hug-contents'
            fontWeight='bold'
            hoverStyle={{
              fill: '#B0ACD6',
            }}
            onClick={() => {
              setShowChanges(true);
            }}
          >{changes ? `Show Details` : `Add Details`}</Text>
        }
      </AutoLayout>
      <Text
        fill='#969FA6'
      >{author}</Text>
    </AutoLayout>
  </AutoLayout>
}

widget.register(Widget)
