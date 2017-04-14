const getNodeInfo = (str, delimitre) => {
  if (str.length === 0) return null;
  const res = {
    deep: 0,
  };
  let value = str;
  while (value[0] === delimitre) {
    res.deep += 1;
    value = value.slice(1);
  }
  res.value = value;
  return res;
};

const parse = (str, delimitre) => {
  if (!delimitre) throw new Error('Delimiter is required');
  if (str[0] === delimitre) throw new Error('There is no root element');
  const nodes = str.split('\n');

  const tree = [];
  let id = 1;

  // define root element
  const rootElement = getNodeInfo(nodes[0], delimitre);
  if (!rootElement) throw new Error('There is no root element');
  rootElement.parent = null;
  rootElement.id = 0;
  tree.push(rootElement);
  nodes.shift();

  const prevElement = {
    0: 0, // Id of root element
  };

  let prevDeep = 0; // Deep of root element
  while (nodes.length) {
    const curenNode = getNodeInfo(nodes[0], delimitre);
    if (curenNode) {
      if (curenNode.deep > prevDeep + 1) throw new Error('Syntax error');

      curenNode.id = id;
      curenNode.parent = prevElement[curenNode.deep - 1];
      tree.push(curenNode);

      prevDeep = curenNode.deep;
      prevElement[curenNode.deep] = curenNode.id;
      id += 1;
    }
    nodes.shift();
  }

  return tree;
};

export default parse;

const getById = (elements, id) => elements.filter(el => el.id === id)[0];

export const getGraphData = (parseData) => {
  const nodes = parseData.map(data => ({
    id: data.id,
    value: data.value,
    deep: data.deep,
  }));

  const links = parseData.map((data) => {
    const link = {};
    if (data.deep === 0) {
      link.source = getById(nodes, data.id);
      const rootElements = parseData.filter(el => el.deep === 0);
      const indexData = rootElements.indexOf(data);
      const indexTarget = indexData + 1;
      if (indexData !== -1 && rootElements[indexTarget]) {
        link.target = getById(nodes, rootElements[indexTarget].id);
        return link;
      }
      return null;
    }

    link.source = getById(nodes, data.parent);
    link.target = getById(nodes, data.id);

    return link;
  }).filter(link => link);

  return {
    links,
    nodes,
  };
};
