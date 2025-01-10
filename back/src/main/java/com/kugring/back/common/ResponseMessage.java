package com.kugring.back.common;

public interface ResponseMessage {

  String SUCCESS = "Success.";

  String MAIL_FAIL = "Mail failed.";
  String ORDER_FAIL = "Order failed.";
  String REFUND_FAIL = "Refund failed";
  String SIGN_IN_FAIL = "Login info failed.";
  String PIN_CHECK_FAIL = "Pin check failed.";
  String VALIDATION_FAIL = "Validation failed.";
  String MENU_PATCH_FAIL = "Menu patch failed.";
  String MENU_CREATE_FAIL = "Menu create failed.";
  String OPTION_PATCH_FAIL = "Option patch failed.";
  String POINT_CHARGE_FAIL = "Point charge failed.";
  String CERTIFICATION_FAIL = "Certification failed.";
  String OPTION_CREATE_FAIL = "Option create failed.";
  String CANCEL_POINT_CHARGE_FAIL = "Cancel point charge failed.";
  String DELETE_POINT_CHARGE_FAIL = "Delete point charge failed.";

  String NOT_EXISTED_USER = "This user does not exist.";
  String NOT_EXISTED_MENU = "This menu does not exists.";
  String NOT_EXISTED_ORDER = "This order does not exists.";
  String NOT_EXISTED_OPTION = "This option does not exists.";
  String NOT_EXISTED_MANAGER = "This manager does not exists.";
  String NOT_EXISTED_ORDER_ITEM = "This order_item does not exists.";
  String NOT_EXISTED_POINT_CHARGE = "This point_charge does not exists.";
  String NOT_EXISTED_ORDER_STATUS = "This order_status does not exists.";
  String NOT_EXISTED_ORDER_ITEM_OPTION = "This order_item_option does not exists.";


  String DUPLICATE_ID = "Duplicate Id.";
  String DUPLICATE_PIN = "Duplicate Pin";
  String ALREADY_OPTION = "Already option.";
  String DATABASE_ERROR = "Database error.";
  String DUPLICATE_NICKNAME = "Duplicate Nickname";
  String ALREADY_POINT_CHARGE = "Already charge point.";
  

  String INSUFFICIENT_BALANCE = "Insufficient balance. Please recharge your account.";


}
