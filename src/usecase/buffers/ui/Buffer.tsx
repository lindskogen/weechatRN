import * as React from 'react';
import { Button, FlatList, ListRenderItem, View } from 'react-native';

import { ParseShape } from 'react-native-parsed-text';
import { cef } from '../../../lib/weechat/colors';
import BufferLine from './BufferLine';

interface Props {
  lines: WeechatLine[];
  lastReadLine?: string;
  onLongPress: () => void;
  parseArgs: ParseShape[];
  bufferId: string;
  fetchMoreLines: (lines: number) => void;
}

interface State {
  desiredLines: number;
  bufferId: string;
}

const keyExtractor = (line: WeechatLine) =>
  line.pointers[line.pointers.length - 1];

export default class Buffer extends React.PureComponent<Props, State> {
  static readonly DEFAULT_LINE_INCREMENT = 300;

  linesList = React.createRef<FlatList>();

  state = {
    desiredLines: Buffer.DEFAULT_LINE_INCREMENT,
    bufferId: this.props.bufferId
  };

  static getDerivedStateFromProps = (props: Props, state: State) => {
    if (props.bufferId !== state.bufferId)
      return {
        desiredLines: Buffer.DEFAULT_LINE_INCREMENT,
        bufferId: props.bufferId
      };
    else return null;
  };

  componentDidUpdate(prevProps: Props) {
    const { bufferId } = this.props;
    if (bufferId !== prevProps.bufferId) {
      this.linesList.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  }

  renderBuffer: ListRenderItem<WeechatLine> = ({ item }) => {
    const { onLongPress, parseArgs, lastReadLine } = this.props;
    const marker = item.pointers.at(-1) === lastReadLine;

    return (
      <>
        {marker && <View style={{ borderWidth: 1, borderColor: cef[5] }} />}
        {item.displayed !== 0 && (
          <BufferLine
            line={item}
            onLongPress={onLongPress}
            parseArgs={parseArgs}
          />
        )}
      </>
    );
  };

  renderMoreLinesButton = () => {
    const { lines } = this.props;
    if (lines.length < this.state.desiredLines) return;

    return (
      <Button
        title="Load more lines"
        onPress={() => {
          const desiredLines =
            this.state.desiredLines + Buffer.DEFAULT_LINE_INCREMENT;
          this.props.fetchMoreLines(desiredLines);
          this.setState(() => ({ desiredLines }));
        }}
      />
    );
  };

  render(): JSX.Element {
    const { lines } = this.props;
    return (
      <FlatList
        ref={this.linesList}
        data={lines}
        inverted
        keyboardDismissMode="interactive"
        keyExtractor={keyExtractor}
        renderItem={this.renderBuffer}
        ListFooterComponent={this.renderMoreLinesButton}
      />
    );
  }
}
