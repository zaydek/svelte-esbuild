(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var is_client = typeof window !== "undefined";
  var tasks = new Set();
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.nodeName === name) {
        let j = 0;
        const remove = [];
        while (j < node.attributes.length) {
          const attribute = node.attributes[j++];
          if (!attributes[attribute.name]) {
            remove.push(attribute.name);
          }
        }
        for (let k = 0; k < remove.length; k++) {
          node.removeAttribute(remove[k]);
        }
        return nodes.splice(i, 1)[0];
      }
    }
    return svg ? svg_element(name) : element(name);
  }
  function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.nodeType === 3) {
        node.data = "" + data;
        return nodes.splice(i, 1)[0];
      }
    }
    return text(data);
  }
  var active_docs = new Set();
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var flushing = false;
  var seen_callbacks = new Set();
  function flush() {
    if (flushing)
      return;
    flushing = true;
    do {
      for (let i = 0; i < dirty_components.length; i += 1) {
        const component = dirty_components[i];
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = new Set();
  var outros;
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  var boolean_attributes = new Set([
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]);
  function create_component(block) {
    block && block.c();
  }
  function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
  }
  function mount_component(component, target, anchor) {
    const {fragment, on_mount, on_destroy, after_update} = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment3, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(parent_component ? parent_component.$$.context : []),
      callbacks: blank_object(),
      dirty,
      skip_bound: false
    };
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment3 ? create_fragment3($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: "open"});
      }
      connectedCallback() {
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr, _oldValue, newValue) {
        this[attr] = newValue;
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // src/components/Hello.svelte
  function create_fragment(ctx) {
    let h1;
    let t;
    let mounted;
    let dispose;
    return {
      c() {
        h1 = element("h1");
        t = text("Hello, world!");
      },
      l(nodes) {
        h1 = claim_element(nodes, "H1", {});
        var h1_nodes = children(h1);
        t = claim_text(h1_nodes, "Hello, world!");
        h1_nodes.forEach(detach);
      },
      m(target, anchor) {
        insert(target, h1, anchor);
        append(h1, t);
        if (!mounted) {
          dispose = listen(h1, "click", ctx[0]);
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(h1);
        mounted = false;
        dispose();
      }
    };
  }
  function instance($$self) {
    const click_handler = () => alert("Hello, world!");
    return [click_handler];
  }
  var Hello = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  };
  var Hello_default = Hello;

  // src/pages/hello-world.svelte
  function create_fragment2(ctx) {
    let hello;
    let current;
    hello = new Hello_default({});
    return {
      c() {
        create_component(hello.$$.fragment);
      },
      l(nodes) {
        claim_component(hello.$$.fragment, nodes);
      },
      m(target, anchor) {
        mount_component(hello, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(hello.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(hello.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(hello, detaching);
      }
    };
  }
  var Hello_world = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment2, safe_not_equal, {});
    }
  };
  var hello_world_default = Hello_world;

  // src/main.js
  var main_default = new hello_world_default({
    target: document.body
  });
})();
