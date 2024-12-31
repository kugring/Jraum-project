enum ResponseMessage {

    
  SUCCESS = "Success.",

  MAIL_FAIL = "Mail failed.",
  ORDER_FAIL = "Order failed.",
  REFUND_FAIL = "Refund failed",
  SIGN_IN_FAIL = "Login info failed.",
  PIN_CHECK_FAIL = "Pin check failed.",
  VALIDATION_FAIL = "Validation failed.",
  MENU_PATCH_FAIL = "Menu patch failed.",
  MENU_CREATE_FAIL = "Menu create failed.",
  OPTION_PATCH_FAIL = "Option patch failed.",
  POINT_CHARGE_FAIL = "Point charge failed.",
  CERTIFICATION_FAIL = "Certification failed.",
  OPTION_CREATE_FAIL = "Option create failed.",
  CANCEL_POINT_CHARGE_FAIL = "Cancel point charge failed.",
  DELETE_POINT_CHARGE_FAIL = "Delete point charge failed.",

  NOT_EXISTED_USER = "This user does not exist.",
  NOT_EXISTED_MENU = "This menu does not exists.",
  NOT_EXISTED_ORDER = "This order does not exists.",
  NOT_EXISTED_OPTION = "This option does not exists.",
  NOT_EXISTED_MANAGER = "This manager does not exists.",
  NOT_EXISTED_ORDER_ITEM = "This order_item does not exists.",
  NOT_EXISTED_ORDER_STATUS = "This order_status does not exists.",
  NOT_EXISTED_ORDER_ITEM_OPTION = "This order_item_option does not exists.",


  DUPLICATE_ID = "Duplicate Id.",
  DUPLICATE_PIN = "Duplicate Pin",
  ALREADY_OPTION = "Already option.",
  DATABASE_ERROR = "Database error.",
  DUPLICATE_NICKNAME = "Duplicate Nickname",
  ALREADY_POINT_CHARGE = "Already charge point.",

  INSUFFICIENT_BALANCE = "Insufficient balance. Please recharge your account."

};

export default ResponseMessage;