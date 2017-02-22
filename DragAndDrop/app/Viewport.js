import React, {
  Component
} from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  PanResponder, 
  Animated, 
  Dimensions
} from 'react-native';


let circleRadius = 36;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  dropZone: {
    height: 100,
    backgroundColor: '#2c3e50'
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff'
  },
  draggableContainer: {
    position: 'absolute',
    top: Window.height / 2 - circleRadius,
    left: Window.width / 2 - circleRadius,
  },
  circle: {
    backgroundColor: '#1abc9c',
    width: circleRadius * 2,
    height: circleRadius * 2,
    borderRadius: circleRadius
  },
  circle2: {
    backgroundColor: 'black',
    width: circleRadius * 2,
    height: circleRadius * 2,
    borderRadius: circleRadius
  }
});

export default class Viewport extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(), //Step 1
      scale: new Animated.Value(1),
      pan2: new Animated.ValueXY() 
    };

    this.panResponder = PanResponder.create({ //Step 2
      onStartShouldSetPanResponder: ()=> true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x:0, y:0});
        Animated.spring(
          this.state.scale,
          { toValue:1.1, friction: 5 }
        ).start();
      },
      onPanResponderMove: Animated.event([null, { //Step 3
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();
      } //Step 4
    });
    this.panResponder2 = PanResponder.create({
      onStartShouldSetPanResponder: ()=> true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        //Set the initial value to the current state
        this.state.pan2.setOffset({x: this.state.pan2.x._value, y: this.state.pan2.y._value});
        this.state.pan2.setValue({x: 0, y: 0});
      },
      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([null, { //Step 3
        dx: this.state.pan2.x,
        dy: this.state.pan2.y
      }]),
      onPanResponderRelease: (e, gesture) => {
        // Flatten the offset to  avoid errativ behavior
        this.state.pan2.flattenOffset();
      }
    });
  }

  renderDraggable() {
    let { pan, scale } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = '0deg';

    let imageStyle = {transform: [{translateX}, {translateY}, {rotate}, {scale}]};
    return (
      <View style={styles.draggableContainer}>
        <Animated.View 
          {...this.panResponder.panHandlers} 
          style={[imageStyle, styles.circle]}>
          <Text style={styles.text}>Drag me!</Text>
        </Animated.View>
        <Animated.View 
          {...this.panResponder2.panHandlers} 
          style={[this.state.pan2.getLayout(), styles.circle2]}>
          <Text style={styles.text}>Drag me Yo!</Text>
        </Animated.View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.mainContiner}>
        <View style={styles.dropZone}>
          <Text style={styles.text}>Drop me here!</Text>
        </View>
        {this.renderDraggable()}
      </View>
    );
  }

}

