import _Driver from '../../models/driver.model';

export const checkDriver = async function (
  agencyId: string,
  phone: string,
  name: string,
  status: number,
): Promise<void> {
  const checkDriver = await _Driver.findOne({ agency_id: agencyId });
  if (!checkDriver) {
    const driver = new _Driver({
      agency_id: agencyId,
      phone: phone,
      name: name,
      status: status,
    }).save();
  } else {
    await checkDriver.update({
      phone: phone,
      name: name,
      status: status,
    });
  }
};
