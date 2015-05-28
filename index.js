'use strict';

var React = require('react-native');
var {
  PixelRatio,
  Navigator,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;


class NavButton extends React.Component {
  render() {
    return (
      <Text style={styles.treenode}>
      <Text style={styles.title}
        onPress={this.props.onPress}>
        {this.props.tocnode.t}</Text><Text style={styles.hit}>{this.props.tocnode.hit}</Text>
      
      </Text>
    ); 
  }
}

var NavToc = React.createClass({
  getInitialState:function() {
    return {cur:0};
  }
  ,componentWillMount: function() {
    this._navBarRouteMapper = {
      rightContentForRoute: function(route, navigator) {
        return null;
      },
      titleContentForRoute: function(route, navigator) {
        return (
          <TouchableOpacity
            onPress={() => navigator.push(_getRandomRoute())}>
            <View>
              <Text style={styles.titleText}>{route.title}</Text>
            </View>
          </TouchableOpacity>
        );
      },
      iconForRoute: function(route, navigator) {
        return (
          <TouchableOpacity onPress={() => {
            navigator.popToRoute(route);
          }}>
            <View style={styles.crumbIconPlaceholder} ><Text>{route.title.substring(0,5)}</Text></View>
          </TouchableOpacity>
        );
      },
      separatorForRoute: function(route, navigator) {
        return (
          <TouchableOpacity onPress={navigator.pop}>
            <View style={styles.crumbSeparatorPlaceholder} />
          </TouchableOpacity>
        );
      }
    };
  }
  ,dig:function(n) {
    this.refs.nav.push(this._getCur(n));
    this.setState({cur:n});
  }
  ,renderChild:function(child,idx) {
    return <NavButton onPress={this.dig.bind(this,child)} key={idx}
      tocnode={this.props.toc[child]}></NavButton>
  }
  ,_renderScene: function(route, navigator) {
    var children=enumChildren(this.props.toc,this.state.cur);
    return (
      <ScrollView style={styles.scene}>
        {children.map(this.renderChild)}
      </ScrollView>
    );
  },
  _getCur : function(n) {
    return {
      title: this.props.toc[n].t,
    };
  },

  render: function() {
    return (
      <Navigator ref="nav"
        style={styles.container}
        initialRoute={this._getCur(0)}
        renderScene={this._renderScene}
        navigationBar={
          <Navigator.BreadcrumbNavigationBar
            routeMapper={this._navBarRouteMapper}
          />
        }
      />
    );
  },



});

/*
 <NavButton
          onPress={() => { navigator.push(_getRandomRoute()) }}
          text="Push"
        ></NavButton>
        <NavButton
          onPress={() => { navigator.immediatelyResetRouteStack([_getRandomRoute(), _getRandomRoute()]) }}
          text="Reset w/ 2 scenes"
        ></NavButton>
        <NavButton
          onPress={() => { navigator.popToTop() }}
          text="Pop to top"
        ></NavButton>
        <NavButton
          onPress={() => { navigator.replace(_getRandomRoute()) }}
          text="Replace"
        ></NavButton>
        <NavButton
          onPress={() => { this.props.navigator.pop(); }}
          text="Close breadcrumb example"
        ></NavButton>

*/

var enumChildren=function(toc,cur) {
    var children=[];
    if (!toc || !toc.length || toc.length==1) return children;
    var thisdepth=toc[cur].d||toc[cur].depth;
    if (cur==0) thisdepth=0;
    if (cur+1>=toc.length) return children;
    if ((toc[cur+1].d||toc[cur+1].depth)!= 1+thisdepth) {
      return children;  // no children node
    }
    var n=cur+1;
    var child=toc[n];
    
    while (child) {
      children.push(n);
      var next=toc[n+1];
      if (!next) break;
      if ((next.d||next.depth)==(child.d||child.depth)) {
        n++;
      } else if ((next.d||next.depth)>(child.d||child.depth)) {
        n=child.n||child.next;
      } else break;
      if (n) child=toc[n];else break;
    }
    return children;
}

var styles = StyleSheet.create({
  scene: {
    paddingTop: 70,
    flex: 1,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    padding:10,
    fontSize: 17,
    fontWeight: '500',
  },
  container: {
    overflow: 'hidden',
    backgroundColor: '#dddddd',
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 0,
  },
  crumbIconPlaceholder: {
    flex: 1,
    backgroundColor: '#666666',
  },
  crumbSeparatorPlaceholder: {
    flex: 1,
    backgroundColor: '#aaaaaa',
  },
  title:{
    alignItems:"flex-start"
  },
  hit:{
    color:"red",  
    alignItems:"flex-end"
  },
  treenode:{
    color:"blue",
    alignItems:"stretch"
  }
});

module.exports = NavToc;