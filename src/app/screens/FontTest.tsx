import {View, Text} from 'react-native';

export default function FontTest() {
  return (
    <View style={{padding: 24, marginTop: 60}}>
      <Text style={{fontFamily: 'Inter-Regular', fontSize: 20}}>Inter Regular</Text>
      <Text style={{fontFamily: 'Inter-Medium', fontSize: 20}}>Inter Medium</Text>
      <Text style={{fontFamily: 'Inter-SemiBold', fontSize: 20}}>Inter SemiBold</Text>
      <Text style={{fontFamily: 'Inter-Bold', fontSize: 20}}>Inter Bold</Text>
      <Text style={{fontFamily: 'JetBrainsMono-Regular', fontSize: 20}}>JetBrains Mono</Text>
    </View>
  );
}
