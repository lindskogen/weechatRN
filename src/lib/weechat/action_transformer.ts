export type WeechatReduxAction = {
  type: string;
  payload: any;
};

const reduceToObjectByKey = <T>(array: T[], keyFn: (t: T) => string): object =>
  array.reduce((acc, elem) => ({ ...acc, [keyFn(elem)]: elem }), {});

export const transformToReduxAction = (data: WeechatResponse<any>) => {
  switch (data.id) {
    // Weechat internal events starts with "_"
    case "_buffer_line_added": {
      const object = data.objects[0] as WeechatObject<WeechatLine[]>;
      const line = object.content[0];

      return {
        type: "BUFFER_LINE_ADDED",
        bufferId: line.buffer,
        payload: line
      };
    }
    case "_buffer_closing": {
      const object = data.objects[0] as WeechatObject<WeechatBuffer[]>;
      const buffer = object.content[0];

      return {
        type: "BUFFER_CLOSED",
        bufferId: buffer.pointers[0]
      };
    }
    case "_buffer_opened": {
      const object = data.objects[0] as WeechatObject<WeechatBuffer[]>;
      const buffer = object.content[0];
      buffer.id = buffer.pointers[0];

      return {
        type: "BUFFER_OPENED",
        payload: buffer,
        bufferId: buffer.id
      };
    }
    case "_buffer_renamed": {
      const object = data.objects[0] as WeechatObject<WeechatBuffer[]>;
      const buffer = object.content[0];
      buffer.id = buffer.pointers[0];

      return {
        type: "BUFFER_RENAMED",
        payload: buffer,
        bufferId: buffer.id
      };
    }
    case "_buffer_localvar_removed": {
      const object = data.objects[0] as WeechatObject<WeechatBuffer[]>;
      const buffer = object.content[0];
      buffer.id = buffer.pointers[0];

      return {
        type: "BUFFER_LOCALVAR_REMOVE",
        payload: buffer,
        bufferId: buffer.id
      };
    }
    case "_buffer_title_changed":
    case "_buffer_localvar_added": {
      const object = data.objects[0] as WeechatObject<WeechatBuffer[]>;
      const buffer = object.content[0];
      buffer.id = buffer.pointers[0];

      return {
        type: "BUFFER_LOCALVAR_UPDATE",
        payload: buffer,
        bufferId: buffer.id
      };
    }
    case "buffers": {
      const object = data.objects[0] as WeechatObject<WeechatBuffer[]>;

      return {
        type: "FETCH_BUFFERS",
        payload: reduceToObjectByKey(
          object.content.map(o => ({ ...o, id: o.pointers[0] })),
          buffer => buffer.id
        )
      };
    }
    case "version": {
      const infolist = data.objects[0] as WeechatObject<WeechatInfoList>;

      return {
        type: "FETCH_VERSION",
        payload: infolist.content.value
      };
    }
    case "lines": {
      const object = data.objects[0] as WeechatObject<WeechatLine[]>;
      return {
        type: "FETCH_LINES",
        bufferId: object.content[0].buffer,
        payload: object.content
      };
    }
    default:
      console.log("unhandled event!", data.id, data);
      return null;
  }
};
