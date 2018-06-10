import Conf from 'conf';

onmessage = (event) => {
  const { cwd, state } = event.data;
  const store = new Conf({configName: "config", cwd});

  store.set("state", {
    // directory: {
    //   ...state.directory,
    //   loading: false,
    // },
    // file: {
    //   ...state.file,
    //   loading: false,
    // },
    favorite: state.favorite,
    tag: {
      ...state.tag,
      dialogIsOpen: false,
    },
  })
  postMessage("finished");
}
