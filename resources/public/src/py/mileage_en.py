# 연비측정법: 가득 주유하고 누적 주행거리(Km)를 기록해 둔 다음,
# 기름을 적어도 절반 이상 쓸 만큼 주행하고 나서 다시 누적 주행거리를 기록한다.
# 그리고 다시 가득 주유하며 들어간 기름의 양(L)을 확인한다.
# 마지막으로 두 누적 주행거리의 차이를 가득 주유한 양으로 나눈다.

def gas_mileage(gas_amount, odometer1, odometer2):
    elapsed_trip = abs(odometer1 - odometer2)
    return elapsed_trip / gas_amount

print(gas_mileage(11.3, 625, 926))
