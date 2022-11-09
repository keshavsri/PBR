from src.enums import AgeUnits, AgeGroup, HealthyRangeMethod
from scipy import stats
import statistics
import math


def determine_age_group(flock_age, flock_age_unit):
    age_in_days = 0
    if flock_age_unit == AgeUnits.Days:
        age_in_days = flock_age
    elif flock_age_unit == AgeUnits.Weeks:
        age_in_days = flock_age * 7
    elif flock_age_unit == AgeUnits.Months:
        age_in_days = flock_age * 30
    elif flock_age_unit == AgeUnits.Years:
        age_in_days = flock_age * 365

    if age_in_days in range(0, 6):
        return AgeGroup.Brooder
    elif age_in_days in range(6, 85):
        return AgeGroup.Growing
    elif age_in_days in range(85, 141):
        return AgeGroup.Prelay
    elif age_in_days in range(141, 10001):
        return AgeGroup.Lay


def get_min_max_from_age_group(age_group: AgeGroup):
    if age_group == AgeGroup.Brooder:
        return 0, 5
    elif age_group == AgeGroup.Growing:
        return 6, 84
    elif age_group == AgeGroup.Prelay:
        return 85, 140
    else:
        return 141, 10000

def reference_interval(data, method: HealthyRangeMethod):
    if method == HealthyRangeMethod.Standard:
        N = len(data)
        mean = statistics.mean(data)
        std = statistics.stdev(data)
        t = stats.t(df=N-1).ppf(.975)
        lower_bound = mean - t*std*math.sqrt((N+1)/N)
        upper_bound = mean + t*std*math.sqrt((N+1)/N)
        return lower_bound, upper_bound
