import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { theme } from "../global/styles";
import { useCreateDelivery } from "../lib/mutate";
import { useAppDispatch } from "../utils/hooks";
import { toast } from "../utils/toast";

interface FreeDeliveryProps {
  visible: boolean;
  toggleModal: () => void;
}

const FreeDelivery = ({ visible, toggleModal }: FreeDeliveryProps) => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<string | undefined>();
  const { mutate, isPending } = useCreateDelivery();

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <Animatable.View
        animation={"fadeInUp"}
        duration={1000}
        className="absolute w-full bottom-0"
      >
        <View className="relative">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleModal()}
            className="absolute top-5 z-50 left-6"
          >
            <FontAwesome name="arrow-left" size={24} color={"#000"} />
          </TouchableOpacity>
          <Calendar
            // Initially visible month. Default = now
            initialDate={new Date().toString()}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={new Date().toString()}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={"2030-05-30"}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              mutate({ countdown: day.dateString });
              setTimeout(() => {
                toggleModal();
                toast("date selected", "success");
              }, 1000);
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {
              mutate({ countdown: day.dateString });
              setTimeout(() => {
                toggleModal();
                toast("date selected", "success");
              }, 1000);
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"yyyy MM"}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {}}
            // Hide month navigation arrows. Default = false
            hideArrows={false}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            // renderArrow={(direction) => (
            //   <FontAwesome name="arrow-right" size={28} color={"#000"} />
            // )}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={false}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Show week numbers to the left. Default = false
            showWeekNumbers={true}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            onPressArrowRight={(addMonth) => addMonth()}
            // Disable left arrow. Default = false
            disableArrowLeft={true}
            // Disable right arrow. Default = false
            disableArrowRight={false}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={true}
            // Replace default month and year title with custom one. the function receive a date as parameter
            renderHeader={(date) => (
              <View>
                <Text className="text-xs">
                  Select the final date for free delivery{" "}
                </Text>
              </View>
            )}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={true}
            theme={theme as any}
            displayLoadingIndicator={isPending}
          />
        </View>
      </Animatable.View>
    </Modal>
  );
};

export default FreeDelivery;
