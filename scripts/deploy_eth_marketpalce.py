from brownie import CourseMarketplace, network, config
from .helper_functions import get_account
import time


def deploy_marketplace():
    account = get_account()
    lottery = CourseMarketplace.deploy(
        {'from': account}, publish_source=config['networks'][network.show_active()].get("verify", False))
    return


def main():
    deploy_marketplace()
